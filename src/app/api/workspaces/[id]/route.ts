import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = await getMemberRole(id, user.id);

  if (role !== "owner" && role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.logoUrl !== undefined) updates.logoUrl = parsed.data.logoUrl;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(workspaces)
    .set(updates)
    .where(eq(workspaces.id, id))
    .returning();

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = await getMemberRole(id, user.id);

  if (role !== "owner") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const [deleted] = await db
    .delete(workspaces)
    .where(eq(workspaces.id, id))
    .returning();

  if (!deleted) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
