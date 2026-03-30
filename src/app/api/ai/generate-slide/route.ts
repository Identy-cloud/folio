import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { THEMES, type Theme } from "@/lib/templates/themes";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { SlideElement } from "@/types/elements";

const bodySchema = z.object({
  prompt: z.string().min(1).max(2000),
  theme: z.string().min(1).max(100),
  slideIndex: z.number().int().min(0),
});

const PAID_PLANS = new Set(["creator", "studio", "agency"]);

const ELEMENT_TYPES = ["text", "shape", "divider"] as const;

function buildSystemPrompt(theme: Theme): string {
  return [
    "You are a professional slide designer for editorial-style presentations.",
    `Canvas size: 1920x1080 pixels.`,
    `Theme colors: primary=${theme.primary}, background=${theme.background}, text=${theme.text}, accent=${theme.accent}`,
    `Display font: "${theme.fontDisplay}", Body font: "${theme.fontBody}"`,
    "",
    "Generate a JSON array of slide elements. Each element MUST have these base fields:",
    '  id (string, use "el-1","el-2" etc), type, x, y, w, h, rotation (number, usually 0),',
    "  opacity (0-1, usually 1), zIndex (integer starting at 1), locked (boolean, false)",
    "",
    "Available element types and their required extra fields:",
    "",
    'type "text": content (string, can be short HTML like <b>,<i>), fontFamily (use theme fonts),',
    '  fontSize (number px), fontWeight (number 100-900), lineHeight (number like 1.2),',
    '  letterSpacing (number like 0 or 0.02), color (hex), textAlign ("left"|"center"|"right"),',
    '  verticalAlign ("top"|"middle"|"bottom")',
    "",
    'type "shape": shape ("rect"|"circle"|"triangle"|"diamond"|"star"|"pentagon"|"hexagon"),',
    "  fill (hex color), stroke (hex or \"transparent\"), strokeWidth (number), borderRadius (number)",
    "",
    'type "divider": color (hex), strokeWidth (number 1-4), dashPattern ("solid"|"dashed"|"dotted")',
    "",
    "Design guidelines:",
    "- Create visually balanced, editorial-style layouts",
    "- Use generous whitespace and clear hierarchy",
    "- Keep text concise and impactful",
    "- Use shapes as decorative accents, not backgrounds for every element",
    "- Headings: large fontSize (64-120px), display font",
    "- Body text: medium fontSize (24-36px), body font",
    "- Place elements with enough margin from edges (min 80px)",
    "- Limit to 3-8 elements per slide for clean design",
    "",
    "Return ONLY valid JSON array, no markdown fencing, no explanation.",
  ].join("\n");
}

function isValidElement(el: unknown): el is Record<string, unknown> {
  if (typeof el !== "object" || el === null) return false;
  const obj = el as Record<string, unknown>;
  const requiredBase = ["type", "x", "y", "w", "h"];
  for (const key of requiredBase) {
    if (!(key in obj)) return false;
  }
  if (!ELEMENT_TYPES.includes(obj.type as (typeof ELEMENT_TYPES)[number])) {
    return false;
  }
  if (typeof obj.x !== "number" || typeof obj.y !== "number") return false;
  if (typeof obj.w !== "number" || typeof obj.h !== "number") return false;
  return true;
}

function sanitizeElement(raw: Record<string, unknown>, idx: number): SlideElement | null {
  const type = raw.type as string;
  const base = {
    id: nanoid(),
    type: type as SlideElement["type"],
    x: Math.max(0, Math.min(1920, Number(raw.x) || 0)),
    y: Math.max(0, Math.min(1080, Number(raw.y) || 0)),
    w: Math.max(10, Math.min(1920, Number(raw.w) || 200)),
    h: Math.max(10, Math.min(1080, Number(raw.h) || 100)),
    rotation: Number(raw.rotation) || 0,
    opacity: Math.max(0, Math.min(1, Number(raw.opacity) ?? 1)),
    zIndex: idx + 1,
    locked: false,
  };

  if (type === "text") {
    return {
      ...base,
      type: "text",
      content: String(raw.content ?? "Text"),
      fontFamily: String(raw.fontFamily ?? "var(--font-dm-sans)"),
      fontSize: Math.max(8, Math.min(300, Number(raw.fontSize) || 32)),
      fontWeight: Number(raw.fontWeight) || 400,
      lineHeight: Number(raw.lineHeight) || 1.4,
      letterSpacing: Number(raw.letterSpacing) || 0,
      color: String(raw.color ?? "#000000"),
      textAlign: (["left", "center", "right"].includes(String(raw.textAlign)) ? raw.textAlign : "left") as "left" | "center" | "right",
      verticalAlign: (["top", "middle", "bottom"].includes(String(raw.verticalAlign)) ? raw.verticalAlign : "top") as "top" | "middle" | "bottom",
    };
  }

  if (type === "shape") {
    const validShapes = ["rect", "circle", "triangle", "diamond", "star", "pentagon", "hexagon"];
    return {
      ...base,
      type: "shape",
      shape: (validShapes.includes(String(raw.shape)) ? raw.shape : "rect") as "rect" | "circle" | "triangle" | "diamond" | "star" | "pentagon" | "hexagon",
      fill: String(raw.fill ?? "#000000"),
      stroke: String(raw.stroke ?? "transparent"),
      strokeWidth: Number(raw.strokeWidth) || 0,
      borderRadius: Number(raw.borderRadius) || 0,
    };
  }

  if (type === "divider") {
    const validDash = ["solid", "dashed", "dotted"];
    return {
      ...base,
      type: "divider",
      color: String(raw.color ?? "#000000"),
      strokeWidth: Math.max(1, Math.min(10, Number(raw.strokeWidth) || 2)),
      dashPattern: (validDash.includes(String(raw.dashPattern)) ? raw.dashPattern : "solid") as "solid" | "dashed" | "dotted",
    };
  }

  return null;
}

function parseAIResponse(text: string): unknown[] {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  cleaned = cleaned.trim();
  const parsed: unknown = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("Response is not an array");
  return parsed;
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

  const rl = await checkRateLimit(`ai-generate:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { prompt, theme: themeKey } = parsed.data;
  const theme: Theme = THEMES[themeKey] ?? THEMES["editorial-blue"];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: buildSystemPrompt(theme),
      messages: [{ role: "user", content: `Create a slide for: ${prompt}` }],
    });

    const block = message.content[0];
    const text = block.type === "text" ? block.text : "";

    const rawElements = parseAIResponse(text);
    const elements: SlideElement[] = [];

    for (let i = 0; i < rawElements.length; i++) {
      const el = rawElements[i];
      if (!isValidElement(el)) continue;
      const sanitized = sanitizeElement(el, i);
      if (sanitized) elements.push(sanitized);
    }

    if (elements.length === 0) {
      return Response.json({ error: "AI produced no valid elements" }, { status: 502 });
    }

    return Response.json({ elements });
  } catch {
    return Response.json({ error: "AI generation failed" }, { status: 502 });
  }
}
