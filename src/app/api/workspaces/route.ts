import { db } from "@/db";
import { workspaces, workspaceMembers, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, user.id));

  const result = memberships.map((m) => ({
    ...m.workspace,
    role: m.role,
  }));

  return Response.json(result);
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`ws-create:${user.id}`, 5, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);

  if (!limits.canCollaborate) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Studio or Agency to create workspaces", plan },
      { status: 403 }
    );
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: parsed.data.name,
      ownerId: user.id,
      plan,
    })
    .returning();

  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId: user.id,
    role: "owner",
  });

  return Response.json(workspace, { status: 201 });
}
