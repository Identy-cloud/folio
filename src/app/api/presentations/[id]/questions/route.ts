import { db } from "@/db";
import { questions, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, and, desc, sql } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const postSchema = z.object({
  text: z.string().min(1).max(500),
  authorName: z.string().min(1).max(100),
});

const patchSchema = z.object({
  questionId: z.string().uuid(),
  action: z.enum(["upvote", "markAnswered"]),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.presentationId, id))
    .orderBy(desc(questions.upvotes), desc(questions.createdAt));

  return Response.json(rows);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(`qa-post:${ip}`, 5, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(eq(presentations.id, id))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Presentation not found" }, { status: 404 });
  }

  const [question] = await db
    .insert(questions)
    .values({
      presentationId: id,
      text: parsed.data.text,
      authorName: parsed.data.authorName,
    })
    .returning();

  return Response.json(question, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { questionId, action } = parsed.data;

  if (action === "upvote") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const rl = await checkRateLimit(`qa-upvote:${ip}:${questionId}`, 1, 60_000);
    if (!rl.allowed) return rateLimitResponse(rl);

    const [updated] = await db
      .update(questions)
      .set({ upvotes: sql`${questions.upvotes} + 1` })
      .where(
        and(eq(questions.id, questionId), eq(questions.presentationId, id))
      )
      .returning();

    if (!updated) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    return Response.json(updated);
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(
      and(eq(presentations.id, id), eq(presentations.userId, user.id))
    )
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found or not owner" }, { status: 403 });
  }

  const [updated] = await db
    .update(questions)
    .set({ answered: true })
    .where(
      and(eq(questions.id, questionId), eq(questions.presentationId, id))
    )
    .returning();

  if (!updated) {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }

  return Response.json(updated);
}
