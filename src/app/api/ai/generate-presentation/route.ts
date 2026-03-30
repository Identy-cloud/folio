import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const bodySchema = z.object({
  topic: z.string().min(1).max(2000),
  slideCount: z.number().int().min(4).max(12).optional().default(8),
  style: z.string().max(200).optional(),
  language: z.string().max(10).optional().default("es"),
});

export interface GeneratedSlide {
  title: string;
  subtitle: string;
  body: string;
  layout: "title" | "title-content" | "two-columns" | "image-text" | "quote" | "section-header";
  notes: string;
}

const PAID_PLANS = new Set(["creator", "studio", "agency"]);

function buildSystemPrompt(slideCount: number, language: string, style?: string): string {
  const styleLine = style ? `\nStyle hints: ${style}` : "";
  return [
    "You are an expert presentation strategist and content writer.",
    `Generate a complete ${slideCount}-slide presentation outline as a JSON array.`,
    `Language: ${language === "es" ? "Spanish" : language === "en" ? "English" : language}`,
    styleLine,
    "",
    "Each slide object MUST have exactly these fields:",
    '  title (string): short, impactful slide title',
    '  subtitle (string): supporting line, can be empty for some layouts',
    '  body (string): main content text (2-4 sentences for content slides, empty for title/section)',
    '  layout (string): one of "title", "title-content", "two-columns", "image-text", "quote", "section-header"',
    '  notes (string): 1-2 sentence speaker notes',
    "",
    "Structure guidelines:",
    "- Slide 1: always layout \"title\" (main presentation title + subtitle)",
    "- Slide 2: \"section-header\" or \"title-content\" (agenda or intro)",
    "- Middle slides: mix of \"title-content\", \"two-columns\", \"image-text\", \"quote\"",
    "- Second to last: \"quote\" or key takeaway",
    "- Last slide: \"section-header\" (closing / thank you / CTA)",
    "",
    "Content guidelines:",
    "- Professional, editorial tone",
    "- Titles: max 6 words, impactful",
    "- Body text: concise, no filler",
    "- Include relevant data points or examples when applicable",
    "- For two-columns layout: separate left and right content with ' ||| ' delimiter in body",
    "",
    "Return ONLY valid JSON array, no markdown fencing, no explanation.",
  ].join("\n");
}

function parseResponse(text: string): GeneratedSlide[] {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  cleaned = cleaned.trim();
  const parsed: unknown = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("Response is not an array");

  const validLayouts = new Set(["title", "title-content", "two-columns", "image-text", "quote", "section-header"]);

  return parsed.map((item: unknown) => {
    const obj = item as Record<string, unknown>;
    const layout = String(obj.layout ?? "title-content");
    return {
      title: String(obj.title ?? ""),
      subtitle: String(obj.subtitle ?? ""),
      body: String(obj.body ?? ""),
      layout: (validLayouts.has(layout) ? layout : "title-content") as GeneratedSlide["layout"],
      notes: String(obj.notes ?? ""),
    };
  });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  if (!PAID_PLANS.has(plan)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Creator plan for AI generation", plan },
      { status: 403 },
    );
  }

  const rl = await checkRateLimit(`ai-presentation:${user.id}`, 5, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { topic, slideCount, style, language } = parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: buildSystemPrompt(slideCount, language, style),
      messages: [{ role: "user", content: `Create a presentation about: ${topic}` }],
    });

    const block = message.content[0];
    const text = block.type === "text" ? block.text : "";
    const slides = parseResponse(text);

    if (slides.length === 0) {
      return Response.json({ error: "AI produced no valid slides" }, { status: 502 });
    }

    return Response.json({ slides });
  } catch {
    return Response.json({ error: "AI generation failed" }, { status: 502 });
  }
}
