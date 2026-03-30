import { db } from "@/db";
import { presentationViews, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { getUserPlan } from "@/lib/stripe";
import { getPlanLimits } from "@/lib/plan-limits";
import { createHash } from "crypto";

function anonymizeIp(ip: string): string {
  const dailySalt = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(ip + dailySalt)
    .digest("hex")
    .slice(0, 16);
}

const postSchema = z.object({
  presentationId: z.string().uuid(),
  slideIndex: z.number().int().min(0).optional(),
  duration: z.number().int().min(0).optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(`analytics:${ip}`, 60, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { presentationId, slideIndex, duration } = parsed.data;

  await db.insert(presentationViews).values({
    presentationId,
    slideIndex: slideIndex ?? null,
    duration: duration ?? null,
    viewerIp: anonymizeIp(ip),
    userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
  });

  return Response.json({ ok: true }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);
  if (!limits.canUseAnalytics) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to access analytics", plan },
      { status: 403 }
    );
  }

  const presentationId = request.nextUrl.searchParams.get("presentationId");
  if (!presentationId) {
    return Response.json({ error: "presentationId is required" }, { status: 400 });
  }

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(and(eq(presentations.id, presentationId), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const [totals] = await db
    .select({
      totalViews: count(),
      uniqueViewers: sql<number>`COUNT(DISTINCT ${presentationViews.viewerIp})`,
      avgDuration: sql<number>`COALESCE(AVG(${presentationViews.duration}), 0)::int`,
    })
    .from(presentationViews)
    .where(eq(presentationViews.presentationId, presentationId));

  const viewsBySlide = await db
    .select({
      slideIndex: presentationViews.slideIndex,
      views: count(),
    })
    .from(presentationViews)
    .where(
      and(
        eq(presentationViews.presentationId, presentationId),
        sql`${presentationViews.slideIndex} IS NOT NULL`
      )
    )
    .groupBy(presentationViews.slideIndex)
    .orderBy(presentationViews.slideIndex);

  const recentViews = await db
    .select({
      createdAt: presentationViews.createdAt,
      duration: presentationViews.duration,
    })
    .from(presentationViews)
    .where(eq(presentationViews.presentationId, presentationId))
    .orderBy(desc(presentationViews.createdAt))
    .limit(50);

  return Response.json({
    totalViews: totals.totalViews,
    uniqueViewers: totals.uniqueViewers,
    avgDuration: totals.avgDuration,
    viewsBySlide,
    recentViews,
  });
}
