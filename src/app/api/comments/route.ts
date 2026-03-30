import { db } from "@/db";
import { comments, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, and, desc, isNull } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const postSchema = z.object({
  presentationId: z.string().uuid(),
  slideIndex: z.number().int().min(0),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().max(255).optional(),
  content: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
});

interface CommentRow {
  id: string;
  presentationId: string;
  slideIndex: number;
  authorName: string;
  authorEmail: string | null;
  content: string;
  resolved: boolean;
  parentId: string | null;
  createdAt: Date;
}

interface CommentWithReplies extends CommentRow {
  replies: CommentRow[];
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(`comments:${ip}`, 10, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { presentationId, slideIndex, authorName, authorEmail, content, parentId } =
    parsed.data;

  const [pres] = await db
    .select({ id: presentations.id, userId: presentations.userId, title: presentations.title })
    .from(presentations)
    .where(eq(presentations.id, presentationId))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Presentation not found" }, { status: 404 });
  }

  let resolvedParentId: string | null = null;
  let parentComment: CommentRow | undefined;

  if (parentId) {
    const [parent] = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, parentId),
          eq(comments.presentationId, presentationId)
        )
      )
      .limit(1);

    if (!parent) {
      return Response.json({ error: "Parent comment not found" }, { status: 404 });
    }
    parentComment = parent;
    resolvedParentId = parent.parentId ?? parent.id;
  }

  const [comment] = await db
    .insert(comments)
    .values({
      presentationId,
      slideIndex,
      authorName,
      authorEmail: authorEmail ?? null,
      content,
      parentId: resolvedParentId,
    })
    .returning();

  await createNotification({
    userId: pres.userId,
    type: parentComment ? "reply" : "comment",
    title: parentComment ? "Nueva respuesta" : "Nuevo comentario",
    message: parentComment
      ? `${authorName} respondió a ${parentComment.authorName} en "${pres.title}"`
      : `${authorName} comentó en "${pres.title}"`,
    presentationId,
  }).catch(() => {});

  return Response.json(comment, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const presentationId = request.nextUrl.searchParams.get("presentationId");
  if (!presentationId) {
    return Response.json(
      { error: "presentationId is required" },
      { status: 400 }
    );
  }

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(
      and(
        eq(presentations.id, presentationId),
        eq(presentations.userId, user.id)
      )
    )
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const allComments = await db
    .select()
    .from(comments)
    .where(eq(comments.presentationId, presentationId))
    .orderBy(desc(comments.createdAt));

  const topLevel = allComments.filter((c) => !c.parentId);
  const replies = allComments.filter((c) => c.parentId);

  const threaded: CommentWithReplies[] = topLevel.map((parent) => ({
    ...parent,
    replies: replies
      .filter((r) => r.parentId === parent.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  }));

  return Response.json(threaded);
}
