import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";
import { eq, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const slideSchema = z.object({
  order: z.number(),
  backgroundColor: z.string().default("#ffffff"),
  backgroundImage: z.string().nullable().default(null),
  transition: z.string().default("fade"),
  transitionDuration: z.number().nullable().optional(),
  transitionEasing: z.string().nullable().optional(),
  elements: z.array(z.record(z.string(), z.unknown())).default([]),
  mobileElements: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
  notes: z.string().default(""),
});

const importSchema = z.object({
  version: z.number().min(1).max(2),
  presentation: z.object({
    title: z.string().max(255).default("Imported presentation"),
    theme: z.string().default("editorial-blue"),
    customThemes: z.record(z.string(), z.unknown()).optional(),
  }),
  slides: z.array(slideSchema).min(1).max(200),
});

const legacySchema = z.object({
  version: z.literal(1),
  theme: z.string().optional(),
  slides: z.array(z.record(z.string(), z.unknown())).min(1).max(200),
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
      { error: "Plan limit reached", limit: limits.maxPresentations },
      { status: 403 }
    );
  }

  const raw = await request.json().catch(() => null);
  if (!raw) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const v2 = importSchema.safeParse(raw);
  if (v2.success) {
    return createFromV2(v2.data, user.id);
  }

  const v1 = legacySchema.safeParse(raw);
  if (v1.success) {
    return createFromV1(v1.data, user.id);
  }

  return Response.json(
    { error: "Invalid format", details: v2.error.flatten() },
    { status: 400 }
  );
}

async function createFromV2(
  data: z.infer<typeof importSchema>,
  userId: string
) {
  const [pres] = await db
    .insert(presentations)
    .values({
      userId,
      title: `${data.presentation.title} (imported)`,
      slug: nanoid(10),
      theme: data.presentation.theme,
      customThemes: data.presentation.customThemes ?? {},
    })
    .returning();

  await db.insert(slides).values(
    data.slides.map((s, i) => ({
      id: nanoid(),
      presentationId: pres.id,
      order: s.order ?? i,
      backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      transition: s.transition,
      transitionDuration: s.transitionDuration ?? null,
      transitionEasing: s.transitionEasing ?? null,
      elements: reassignIds(s.elements),
      mobileElements: s.mobileElements
        ? reassignIds(s.mobileElements)
        : null,
      notes: s.notes,
    }))
  );

  return Response.json(pres, { status: 201 });
}

async function createFromV1(
  data: z.infer<typeof legacySchema>,
  userId: string
) {
  const [pres] = await db
    .insert(presentations)
    .values({
      userId,
      title: "Imported presentation",
      slug: nanoid(10),
      theme: data.theme ?? "editorial-blue",
    })
    .returning();

  await db.insert(slides).values(
    data.slides.map((s, i) => ({
      id: nanoid(),
      presentationId: pres.id,
      order: i,
      elements: reassignIds(
        Array.isArray(s.elements) ? s.elements as Record<string, unknown>[] : []
      ),
      notes: typeof s.notes === "string" ? s.notes : "",
    }))
  );

  return Response.json(pres, { status: 201 });
}

function reassignIds(
  elements: Record<string, unknown>[]
): Record<string, unknown>[] {
  return elements.map((el) => ({ ...el, id: nanoid() }));
}
