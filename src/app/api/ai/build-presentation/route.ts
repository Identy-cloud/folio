import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits, FREE_THEMES } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";
import { THEMES } from "@/lib/templates/themes";
import { buildPresentationSlides } from "@/lib/ai-presentation-builder";
import { nanoid } from "nanoid";
import { eq, count } from "drizzle-orm";
import { z } from "zod";

const generatedSlideSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  layout: z.enum(["title", "title-content", "two-columns", "image-text", "quote", "section-header"]),
  notes: z.string(),
});

const bodySchema = z.object({
  slides: z.array(generatedSlideSchema).min(1).max(20),
  theme: z.string().max(100).optional().default("editorial-blue"),
  title: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`create:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);
  const [presCount] = await db
    .select({ total: count() })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  if ((presCount?.total ?? 0) >= limits.maxPresentations) {
    return Response.json(
      { error: "PLAN_LIMIT", plan, limit: limits.maxPresentations },
      { status: 403 },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { slides: generatedSlides, theme: themeKey, title } = parsed.data;

  if (!limits.canUseAllTemplates && !(FREE_THEMES as readonly string[]).includes(themeKey)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to use this theme", plan },
      { status: 403 },
    );
  }

  const theme = THEMES[themeKey] ?? THEMES["editorial-blue"];
  const presTitle = title ?? generatedSlides[0]?.title ?? "AI Presentation";

  const [presentation] = await db
    .insert(presentations)
    .values({
      userId: user.id,
      title: presTitle,
      slug: nanoid(10),
      theme: themeKey,
    })
    .returning();

  const builtSlides = buildPresentationSlides(generatedSlides, theme, presentation.id);

  if (builtSlides.length > 0) {
    await db.insert(slides).values(
      builtSlides.map((s) => ({
        presentationId: presentation.id,
        order: s.order,
        transition: s.transition,
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        elements: s.elements,
        notes: s.notes,
      })),
    );
  }

  return Response.json(presentation, { status: 201 });
}
