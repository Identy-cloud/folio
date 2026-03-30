import { db } from "@/db";
import { presentationViews, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, and, sql, count, desc, gte } from "drizzle-orm";
import { getUserPlan } from "@/lib/stripe";
import { getPlanLimits } from "@/lib/plan-limits";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`analytics-overview:${user.id}`, 30, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);
  if (!limits.canUseAnalytics) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Creator plan for analytics", plan },
      { status: 403 },
    );
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const userPresentations = db
    .select({ id: presentations.id })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  const [totals] = await db
    .select({
      totalViews: count(),
      uniqueViewers: sql<number>`COUNT(DISTINCT ${presentationViews.viewerIp})`,
    })
    .from(presentationViews)
    .where(sql`${presentationViews.presentationId} IN (${userPresentations})`);

  const mostViewed = await db
    .select({
      presentationId: presentationViews.presentationId,
      title: presentations.title,
      views: count(),
    })
    .from(presentationViews)
    .innerJoin(
      presentations,
      eq(presentationViews.presentationId, presentations.id),
    )
    .where(eq(presentations.userId, user.id))
    .groupBy(presentationViews.presentationId, presentations.title)
    .orderBy(desc(count()))
    .limit(1);

  const dailyViews = await db
    .select({
      date: sql<string>`TO_CHAR(${presentationViews.createdAt}::date, 'YYYY-MM-DD')`,
      views: count(),
    })
    .from(presentationViews)
    .where(
      and(
        sql`${presentationViews.presentationId} IN (${userPresentations})`,
        gte(presentationViews.createdAt, sevenDaysAgo),
      ),
    )
    .groupBy(sql`${presentationViews.createdAt}::date`)
    .orderBy(sql`${presentationViews.createdAt}::date`);

  const dailyMap = new Map(dailyViews.map((d) => [d.date, d.views]));
  const last7Days: { date: string; views: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last7Days.push({ date: key, views: dailyMap.get(key) ?? 0 });
  }

  return Response.json({
    totalViews: totals.totalViews,
    uniqueViewers: totals.uniqueViewers,
    mostViewed: mostViewed[0] ?? null,
    last7Days,
  });
}
