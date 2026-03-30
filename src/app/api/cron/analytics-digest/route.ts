import { db } from "@/db";
import { users, presentations, presentationViews } from "@/db/schema";
import { sendAnalyticsDigest } from "@/lib/email";
import type { AnalyticsDigestData } from "@/lib/email-templates-digest";
import { eq, and, gte, sql, inArray, count } from "drizzle-orm";
import type { NextRequest } from "next/server";

const BATCH_SIZE = 50;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const eligibleUsers = await db
    .selectDistinct({ userId: presentations.userId })
    .from(presentationViews)
    .innerJoin(presentations, eq(presentationViews.presentationId, presentations.id))
    .innerJoin(users, eq(presentations.userId, users.id))
    .where(
      and(
        gte(presentationViews.createdAt, oneWeekAgo),
        inArray(users.plan, ["pro", "team"]),
        eq(users.emailDigest, true)
      )
    );

  const userIds = eligibleUsers.map((r) => r.userId);
  let sent = 0;

  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    const batch = userIds.slice(i, i + BATCH_SIZE);
    const promises = batch.map((userId) => processUser(userId, oneWeekAgo, twoWeeksAgo));
    const results = await Promise.allSettled(promises);
    sent += results.filter((r) => r.status === "fulfilled" && r.value).length;
  }

  return Response.json({ ok: true, sent, eligible: userIds.length });
}

async function processUser(
  userId: string,
  oneWeekAgo: Date,
  twoWeeksAgo: Date
): Promise<boolean> {
  const [user] = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) return false;

  const [thisWeek] = await db
    .select({ total: count() })
    .from(presentationViews)
    .innerJoin(presentations, eq(presentationViews.presentationId, presentations.id))
    .where(
      and(
        eq(presentations.userId, userId),
        gte(presentationViews.createdAt, oneWeekAgo)
      )
    );

  const [lastWeek] = await db
    .select({ total: count() })
    .from(presentationViews)
    .innerJoin(presentations, eq(presentationViews.presentationId, presentations.id))
    .where(
      and(
        eq(presentations.userId, userId),
        gte(presentationViews.createdAt, twoWeeksAgo),
        sql`${presentationViews.createdAt} < ${oneWeekAgo}`
      )
    );

  const topPresentations = await db
    .select({
      title: presentations.title,
      slug: presentations.slug,
      views: count(),
    })
    .from(presentationViews)
    .innerJoin(presentations, eq(presentationViews.presentationId, presentations.id))
    .where(
      and(
        eq(presentations.userId, userId),
        gte(presentationViews.createdAt, oneWeekAgo)
      )
    )
    .groupBy(presentations.id, presentations.title, presentations.slug)
    .orderBy(sql`count(*) desc`)
    .limit(3);

  const data: AnalyticsDigestData = {
    userName: user.name ?? user.email.split("@")[0],
    totalViews: thisWeek?.total ?? 0,
    previousWeekViews: lastWeek?.total ?? 0,
    topPresentations: topPresentations.map((p) => ({
      title: p.title,
      slug: p.slug,
      views: p.views,
    })),
  };

  await sendAnalyticsDigest(user.email, data);
  return true;
}
