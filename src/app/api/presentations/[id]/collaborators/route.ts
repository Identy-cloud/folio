import { db } from "@/db";
import { presentations, collaborators, users } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { getPlanLimits } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

async function verifyOwnership(presentationId: string, userId: string) {
  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, presentationId), eq(presentations.userId, userId)))
    .limit(1);
  return pres ?? null;
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
  const pres = await verifyOwnership(id, user.id);
  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const rows = await db
    .select({
      id: collaborators.id,
      role: collaborators.role,
      createdAt: collaborators.createdAt,
      userId: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(collaborators)
    .innerJoin(users, eq(collaborators.userId, users.id))
    .where(eq(collaborators.presentationId, id));

  const limits = getPlanLimits(await getUserPlan(user.id));

  return Response.json({
    collaborators: rows,
    maxCollaborators: limits.maxCollaborators === Infinity ? null : limits.maxCollaborators,
    canCollaborate: limits.canCollaborate,
  });
}

const addSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]).default("editor"),
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
  const pres = await verifyOwnership(id, user.id);
  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const limits = getPlanLimits(await getUserPlan(user.id));
  if (!limits.canCollaborate) {
    return Response.json(
      { error: "Your plan does not support collaboration. Upgrade to Studio or Agency." },
      { status: 403 }
    );
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = addSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, role } = parsed.data;

  if (email === user.email) {
    return Response.json({ error: "Cannot add yourself as a collaborator" }, { status: 400 });
  }

  const [targetUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!targetUser) {
    return Response.json({ error: "No user found with that email" }, { status: 404 });
  }

  const existing = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.presentationId, id));

  if (existing.some((c) => c.userId === targetUser.id)) {
    return Response.json({ error: "User is already a collaborator" }, { status: 409 });
  }

  if (limits.maxCollaborators !== Infinity && existing.length >= limits.maxCollaborators) {
    return Response.json(
      { error: `Collaborator limit reached (${limits.maxCollaborators}). Upgrade your plan.` },
      { status: 403 }
    );
  }

  const [created] = await db
    .insert(collaborators)
    .values({
      presentationId: id,
      userId: targetUser.id,
      role,
    })
    .returning();

  await createNotification({
    userId: targetUser.id,
    type: "collaborator_added",
    title: "Agregado como colaborador",
    message: `${user.name ?? user.email} te agrego a "${pres.title}"`,
    presentationId: id,
  }).catch(() => {});

  return Response.json({
    id: created.id,
    role: created.role,
    createdAt: created.createdAt,
    userId: targetUser.id,
    email: targetUser.email,
    name: targetUser.name,
    avatarUrl: targetUser.avatarUrl,
  }, { status: 201 });
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
  const pres = await verifyOwnership(id, user.id);
  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const collaboratorId = searchParams.get("collaboratorId");
  if (!collaboratorId) {
    return Response.json({ error: "Missing collaboratorId" }, { status: 400 });
  }

  const [deleted] = await db
    .delete(collaborators)
    .where(
      and(
        eq(collaborators.id, collaboratorId),
        eq(collaborators.presentationId, id)
      )
    )
    .returning();

  if (!deleted) {
    return Response.json({ error: "Collaborator not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
