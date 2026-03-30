import { db } from "@/db";
import { presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { THEMES } from "@/lib/templates/themes";
import { hash } from "bcryptjs";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(pres);
}

const patchSchema = z.object({
  title: z.string().max(255).optional(),
  isPublic: z.boolean().optional(),
  theme: z.enum(Object.keys(THEMES) as [string, ...string[]]).optional(),
  thumbnailUrl: z.string().url().optional(),
  password: z.string().max(100).nullable().optional(),
  folderId: z.string().uuid().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.isPublic !== undefined) updates.isPublic = parsed.data.isPublic;
  if (parsed.data.theme !== undefined) updates.theme = parsed.data.theme;
  if (parsed.data.thumbnailUrl !== undefined) updates.thumbnailUrl = parsed.data.thumbnailUrl;
  if (parsed.data.folderId !== undefined) updates.folderId = parsed.data.folderId;
  if (parsed.data.password !== undefined) {
    updates.password = parsed.data.password
      ? await hash(parsed.data.password, 10)
      : null;
  }

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
