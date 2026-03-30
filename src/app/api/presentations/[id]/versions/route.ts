import { db } from "@/db";
import { presentations, slides, presentationVersions } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { and, eq, asc, desc, count } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const limits = getPlanLimits(user.plan);

  const versions = await db
    .select({
      id: presentationVersions.id,
      version: presentationVersions.version,
      title: presentationVersions.title,
      createdAt: presentationVersions.createdAt,
    })
    .from(presentationVersions)
    .where(eq(presentationVersions.presentationId, id))
    .orderBy(desc(presentationVersions.version))
    .limit(limits.maxVersions);

  return Response.json(versions);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkRateLimit(`version-create:${user.id}`, 10, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const limits = getPlanLimits(user.plan);

  const currentSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  const [countResult] = await db
    .select({ total: count() })
    .from(presentationVersions)
    .where(eq(presentationVersions.presentationId, id));

  const nextVersion = (countResult?.total ?? 0) + 1;

  const body = await request.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.slice(0, 255) : null;

  const [created] = await db
    .insert(presentationVersions)
    .values({
      presentationId: id,
      version: nextVersion,
      snapshot: currentSlides,
      title,
    })
    .returning();

  const totalAfter = countResult?.total ?? 0;
  if (totalAfter >= limits.maxVersions) {
    const oldest = await db
      .select({ id: presentationVersions.id })
      .from(presentationVersions)
      .where(eq(presentationVersions.presentationId, id))
      .orderBy(asc(presentationVersions.version))
      .limit(totalAfter - limits.maxVersions + 1);

    if (oldest.length > 0) {
      for (const row of oldest) {
        await db
          .delete(presentationVersions)
          .where(eq(presentationVersions.id, row.id));
      }
    }
  }

  return Response.json(created, { status: 201 });
}
