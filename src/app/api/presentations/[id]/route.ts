import { db } from "@/db";
import { presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.isPublic !== undefined) updates.isPublic = body.isPublic;
  if (body.theme !== undefined) updates.theme = body.theme;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(presentations)
    .set(updates)
    .where(
      and(eq(presentations.id, id), eq(presentations.userId, user.id))
    )
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

  const [deleted] = await db
    .delete(presentations)
    .where(
      and(eq(presentations.id, id), eq(presentations.userId, user.id))
    )
    .returning();

  if (!deleted) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
