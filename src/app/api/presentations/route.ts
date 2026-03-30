import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, desc, and, inArray, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { generateTemplate } from "@/lib/templates/generator";
import { TEMPLATES } from "@/lib/templates/templates";
import { THEMES } from "@/lib/templates/themes";
import { getPlanLimits, FREE_THEMES } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";

const createSchema = z.object({
  title: z.string().max(255).optional(),
  theme: z.enum(Object.keys(THEMES) as [string, ...string[]]).optional(),
  templateId: z.string().max(50).optional(),
  useTemplate: z.boolean().optional(),
});

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(presentations)
    .where(eq(presentations.userId, user.id))
    .orderBy(desc(presentations.updatedAt));

  // Fetch first slide for each presentation (for thumbnail preview)
  const ids = rows.map((r) => r.id);
  const firstSlides = ids.length > 0
    ? await db
        .select()
        .from(slides)
        .where(and(eq(slides.order, 0), inArray(slides.presentationId, ids)))
        .then((all) => {
          const map = new Map<string, typeof all[number]>();
          for (const s of all) {
            map.set(s.presentationId, s);
          }
          return map;
        })
    : new Map();

  const result = rows.map((p) => {
    const firstSlide = firstSlides.get(p.id);
    return {
      ...p,
      coverSlide: firstSlide
        ? {
            backgroundColor: firstSlide.backgroundColor,
            backgroundImage: firstSlide.backgroundImage,
            elements: firstSlide.elements,
          }
        : null,
    };
  });

  return Response.json(result);
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`create:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  // Check plan limits
  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);
  const [presCount] = await db
    .select({ total: count() })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  if ((presCount?.total ?? 0) >= limits.maxPresentations) {
    return Response.json(
      { error: "PLAN_LIMIT", plan, limit: limits.maxPresentations },
      { status: 403 }
    );
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const title = parsed.data.title ?? "Sin título";
  const theme = parsed.data.theme ?? "editorial-blue";
  const templateId = parsed.data.templateId;
  const useTemplate = parsed.data.useTemplate !== false;

  if (!limits.canUseAllTemplates && !(FREE_THEMES as readonly string[]).includes(theme)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to use this theme", plan },
      { status: 403 }
    );
  }

  const [presentation] = await db
    .insert(presentations)
    .values({
      userId: user.id,
      title,
      slug: nanoid(10),
      theme,
    })
    .returning();

  if (useTemplate) {
    const tpl = templateId ? TEMPLATES.find((t) => t.id === templateId) : null;
    const themeObj = THEMES[theme];
    const templateSlides = tpl && themeObj
      ? tpl.generate(themeObj, theme, presentation.id)
      : generateTemplate(theme, presentation.id);
    if (templateSlides.length > 0) {
      await db.insert(slides).values(
        templateSlides.map((s) => ({
          presentationId: presentation.id,
          order: s.order,
          transition: s.transition,
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage,
          elements: s.elements,
        }))
      );
    }
  } else {
    await db.insert(slides).values({
      presentationId: presentation.id,
      order: 0,
      elements: [],
    });
  }

  return Response.json(presentation, { status: 201 });
}
