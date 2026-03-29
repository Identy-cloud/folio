import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, desc, and, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { generateTemplate } from "@/lib/templates/generator";
import { THEMES } from "@/lib/templates/themes";

const createSchema = z.object({
  title: z.string().max(255).optional(),
  theme: z.enum(Object.keys(THEMES) as [string, ...string[]]).optional(),
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

  const rl = checkRateLimit(`create:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const title = parsed.data.title ?? "Sin título";
  const theme = parsed.data.theme ?? "editorial-blue";
  const useTemplate = parsed.data.useTemplate !== false;

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
    const templateSlides = generateTemplate(theme, presentation.id);
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
