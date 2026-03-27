import { db } from "@/db";
import { slides, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, asc } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const result = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  return Response.json(result);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const body: Array<{
    id: string;
    order: number;
    backgroundColor: string;
    backgroundImage: string | null;
    elements: unknown[];
  }> = await request.json();

  await db.delete(slides).where(eq(slides.presentationId, id));

  if (body.length > 0) {
    await db.insert(slides).values(
      body.map((s) => ({
        id: s.id,
        presentationId: id,
        order: s.order,
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        elements: s.elements,
      }))
    );
  }

  await db
    .update(presentations)
    .set({ updatedAt: new Date() })
    .where(eq(presentations.id, id));

  return Response.json({ success: true });
}
