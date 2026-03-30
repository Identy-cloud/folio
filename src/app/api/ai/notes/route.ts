import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const bodySchema = z.object({
  slideContent: z.string().min(1).max(5000),
  presentationTitle: z.string().min(1).max(200),
  context: z.string().max(2000).optional(),
});

const PAID_PLANS = new Set(["creator", "studio", "agency"]);

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  if (!PAID_PLANS.has(plan)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Creator plan for AI notes", plan },
      { status: 403 },
    );
  }

  const rl = await checkRateLimit(`ai-notes:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { slideContent, presentationTitle, context } = parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI service not configured" },
      { status: 503 },
    );
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = [
    "You are a professional presentation coach.",
    "Generate concise speaker notes (2-3 short paragraphs) for the given slide.",
    "The notes should:",
    "- Expand on the slide's key points with additional detail",
    "- Add talking points that are not visible on the slide",
    "- Suggest a smooth transition to the next topic",
    "- Keep a professional, confident tone matching the presentation style",
    "Return only the speaker notes text, no markdown headers or labels.",
  ].join("\n");

  const userPrompt = [
    `Presentation: "${presentationTitle}"`,
    "",
    "Slide content:",
    slideContent,
    context ? `\nAdditional context: ${context}` : "",
  ].join("\n");

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = message.content[0];
    const notes = block.type === "text" ? block.text : "";

    return Response.json({ notes });
  } catch {
    return Response.json(
      { error: "AI generation failed" },
      { status: 502 },
    );
  }
}
