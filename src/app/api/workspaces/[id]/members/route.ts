import { db } from "@/db";
import { workspaceMembers, workspaces, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plan-limits";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

async function getMemberRole(workspaceId: string, userId: string) {
  const [member] = await db
    .select({ role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    )
    .limit(1);
  return member?.role ?? null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = await getMemberRole(id, user.id);
  if (!role) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const members = await db
    .select({
      id: workspaceMembers.id,
      userId: workspaceMembers.userId,
      role: workspaceMembers.role,
      createdAt: workspaceMembers.createdAt,
      userName: users.name,
      userEmail: users.email,
      userAvatar: users.avatarUrl,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(users.id, workspaceMembers.userId))
    .where(eq(workspaceMembers.workspaceId, id));

  return Response.json(members);
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]).default("member"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const callerRole = await getMemberRole(id, user.id);

  if (callerRole !== "owner" && callerRole !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = inviteSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [ws] = await db
    .select({ plan: workspaces.plan })
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1);

  if (!ws) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const limits = getPlanLimits(ws.plan);
  const existingMembers = await db
    .select({ id: workspaceMembers.id })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, id));

  if (existingMembers.length >= limits.maxCollaborators) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Member limit reached for this plan" },
      { status: 403 }
    );
  }

  const [targetUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (!targetUser) {
    return Response.json(
      { error: "User not found with that email" },
      { status: 404 }
    );
  }

  const [member] = await db
    .insert(workspaceMembers)
    .values({
      workspaceId: id,
      userId: targetUser.id,
      role: parsed.data.role,
    })
    .onConflictDoNothing()
    .returning();

  if (!member) {
    return Response.json(
      { error: "User is already a member" },
      { status: 409 }
    );
  }

  return Response.json(member, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const callerRole = await getMemberRole(id, user.id);

  if (callerRole !== "owner" && callerRole !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");
  if (!memberId) {
    return Response.json({ error: "memberId required" }, { status: 400 });
  }

  const [target] = await db
    .select({ role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.id, memberId),
        eq(workspaceMembers.workspaceId, id)
      )
    )
    .limit(1);

  if (!target) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  if (target.role === "owner") {
    return Response.json(
      { error: "Cannot remove workspace owner" },
      { status: 403 }
    );
  }

  await db
    .delete(workspaceMembers)
    .where(eq(workspaceMembers.id, memberId));

  return Response.json({ success: true });
}
