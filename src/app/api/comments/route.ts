import { db } from "@/db";
import { comments, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const postSchema = z.object({
  presentationId: z.string().uuid(),
  slideIndex: z.number().int().min(0),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().max(255).optional(),
  content: z.string().min(1).max(2000),
});

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

  const { presentationId, slideIndex, authorName, authorEmail, content } =
    parsed.data;

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(eq(presentations.id, presentationId))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Presentation not found" }, { status: 404 });
  }

  const [comment] = await db
    .insert(comments)
    .values({
      presentationId,
      slideIndex,
      authorName,
      authorEmail: authorEmail ?? null,
      content,
    })
    .returning();

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

  return Response.json(allComments);
}
