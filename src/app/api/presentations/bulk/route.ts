import { db } from "@/db";
import { presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const bulkPatchSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(["make_public", "make_private", "move_to_folder"]),
  folderId: z.string().uuid().nullable().optional(),
});

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

async function verifyOwnership(userId: string, ids: string[]) {
  const owned = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(
      and(inArray(presentations.id, ids), eq(presentations.userId, userId))
    );
  return owned.length === ids.length;
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = bulkPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { ids, action, folderId } = parsed.data;

  const allOwned = await verifyOwnership(user.id, ids);
  if (!allOwned) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  switch (action) {
    case "make_public":
      updates.isPublic = true;
      break;
    case "make_private":
      updates.isPublic = false;
      break;
    case "move_to_folder":
      updates.folderId = folderId ?? null;
      break;
  }

  await db
    .update(presentations)
    .set(updates)
    .where(
      and(
        inArray(presentations.id, ids),
        eq(presentations.userId, user.id)
      )
    );

  return Response.json({ success: true, count: ids.length });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = bulkDeleteSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { ids } = parsed.data;

  const allOwned = await verifyOwnership(user.id, ids);
  if (!allOwned) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const deleted = await db
    .delete(presentations)
    .where(
      and(
        inArray(presentations.id, ids),
        eq(presentations.userId, user.id)
      )
    )
    .returning({ id: presentations.id });

  return Response.json({ success: true, count: deleted.length });
}
