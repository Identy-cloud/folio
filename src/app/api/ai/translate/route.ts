import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { db } from "@/db";
import { presentations, slides as slidesTable } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { SlideElement, TextElement } from "@/types/elements";

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian",
  "Portuguese", "Japanese", "Chinese", "Korean", "Arabic",
] as const;

const RTL_LANGUAGES = new Set(["Arabic"]);

const bodySchema = z.object({
  presentationId: z.string().uuid(),
  targetLanguage: z.enum(SUPPORTED_LANGUAGES),
});

const PAID_PLANS = new Set(["creator", "studio", "agency"]);

interface TextLocation {
  slideIdx: number;
  elementId: string;
  content: string;
}

function extractTexts(
  slideRows: { elements: unknown; order: number }[]
): TextLocation[] {
  const locations: TextLocation[] = [];
  for (let si = 0; si < slideRows.length; si++) {
    const elements = slideRows[si].elements as SlideElement[];
    for (const el of elements) {
      if (el.type === "text" && (el as TextElement).content.trim()) {
        locations.push({
          slideIdx: si,
          elementId: el.id,
          content: (el as TextElement).content,
        });
      }
    }
  }
  return locations;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  if (!PAID_PLANS.has(plan)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Creator plan for AI translate", plan },
      { status: 403 },
    );
  }

  const rl = await checkRateLimit(`ai-translate:${user.id}`, 5, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { presentationId, targetLanguage } = parsed.data;

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(and(eq(presentations.id, presentationId), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Presentation not found" }, { status: 404 });
  }

  const slideRows = await db
    .select({ id: slidesTable.id, order: slidesTable.order, elements: slidesTable.elements })
    .from(slidesTable)
    .where(eq(slidesTable.presentationId, presentationId))
    .orderBy(asc(slidesTable.order));

  const textLocations = extractTexts(slideRows);
  if (textLocations.length === 0) {
    return Response.json({ translatedCount: 0 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  const textsForAI = textLocations.map((loc, i) => `[${i}] ${loc.content}`).join("\n");
  const systemPrompt = [
    `Translate the following texts to ${targetLanguage}.`,
    "Maintain all HTML formatting tags (<b>, <i>, <br>, <span>, etc.) exactly as they are.",
    "Do not translate proper nouns or brand names.",
    "Return ONLY a JSON array of strings in the same order.",
    "Example input: [0] Hello <b>World</b>",
    `Example output: ["Hola <b>Mundo</b>"]`,
  ].join("\n");

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: textsForAI }],
    });

    const block = message.content[0];
    const responseText = block.type === "text" ? block.text : "";
    const cleaned = responseText.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const translated: unknown = JSON.parse(cleaned);

    if (!Array.isArray(translated) || translated.length !== textLocations.length) {
      return Response.json({ error: "AI returned invalid response" }, { status: 502 });
    }

    const isRTL = RTL_LANGUAGES.has(targetLanguage);
    const slideUpdates = new Map<number, Map<string, Partial<TextElement>>>();

    for (let i = 0; i < textLocations.length; i++) {
      const loc = textLocations[i];
      const translatedText = String(translated[i]);
      if (!slideUpdates.has(loc.slideIdx)) {
        slideUpdates.set(loc.slideIdx, new Map());
      }
      const changes: Partial<TextElement> = { content: translatedText };
      if (isRTL) {
        changes.textAlign = "right";
      }
      slideUpdates.get(loc.slideIdx)!.set(loc.elementId, changes);
    }

    const updatePromises: Promise<unknown>[] = [];
    for (const [slideIdx, elementChanges] of slideUpdates) {
      const row = slideRows[slideIdx];
      const elements = (row.elements as SlideElement[]).map((el) => {
        const changes = elementChanges.get(el.id);
        if (changes) return { ...el, ...changes };
        return el;
      });
      updatePromises.push(
        db.update(slidesTable).set({ elements }).where(eq(slidesTable.id, row.id))
      );
    }
    await Promise.all(updatePromises);

    return Response.json({ translatedCount: textLocations.length });
  } catch {
    return Response.json({ error: "AI translation failed" }, { status: 502 });
  }
}
