import { db } from "@/db";
import { comments, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const patchSchema = z.object({
  resolved: z.boolean(),
});

async function getCommentWithOwnership(commentId: string, userId: string) {
  const [comment] = await db
    .select({
      id: comments.id,
      presentationId: comments.presentationId,
    })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  if (!comment) return null;

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(
      and(
        eq(presentations.id, comment.presentationId),
        eq(presentations.userId, userId)
      )
    )
    .limit(1);

  if (!pres) return null;

  return comment;
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
  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const comment = await getCommentWithOwnership(id, user.id);
  if (!comment) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(comments)
    .set({ resolved: parsed.data.resolved })
    .where(eq(comments.id, id))
    .returning();

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

  const comment = await getCommentWithOwnership(id, user.id);
  if (!comment) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(comments).where(eq(comments.id, id));

  return Response.json({ success: true });
}
