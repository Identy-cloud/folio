import { db } from "@/db";
import { subscriptions, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plan-limits";
import { eq, count } from "drizzle-orm";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const plan = sub?.status === "active" ? (sub.plan ?? "free") : "free";
  const limits = getPlanLimits(plan);

  const [presCount] = await db
    .select({ total: count() })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  return Response.json({
    plan,
    billingPeriod: sub?.billingPeriod ?? "monthly",
    status: sub?.status ?? "active",
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    presentationCount: presCount?.total ?? 0,
    maxPresentations: limits.maxPresentations,
  });
}
