import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { and, eq, asc, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = checkRateLimit(`create:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const limits = getPlanLimits(user.plan);
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

  const { id } = await params;

  const [original] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!original) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const originalSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  const [newPres] = await db
    .insert(presentations)
    .values({
      userId: user.id,
      title: `${original.title} (copia)`,
      slug: nanoid(10),
      theme: original.theme,
    })
    .returning();

  if (originalSlides.length > 0) {
    await db.insert(slides).values(
      originalSlides.map((s) => ({
        id: nanoid(),
        presentationId: newPres.id,
        order: s.order,
        transition: s.transition,
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        elements: s.elements,
        mobileElements: s.mobileElements,
      }))
    );
  }

  return Response.json(newPres, { status: 201 });
}
