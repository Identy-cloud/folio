import { db } from "@/db";
import { slides, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, asc } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const slideSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  transition: z.enum(["fade", "slide-left", "slide-up", "zoom", "none"]).default("fade"),
  backgroundColor: z.string().max(50),
  backgroundImage: z.string().url().nullable(),
  elements: z.array(z.record(z.string(), z.unknown())),
  mobileElements: z.array(z.record(z.string(), z.unknown())).nullable().default(null),
});

const putSlidesSchema = z.array(slideSchema).max(200);

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

  const raw = await request.json().catch(() => null);
  const parsed = putSlidesSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid slides data", details: parsed.error.flatten() }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    await tx.delete(slides).where(eq(slides.presentationId, id));

    if (parsed.data.length > 0) {
      await tx.insert(slides).values(
        parsed.data.map((s) => ({
          id: s.id,
          presentationId: id,
          order: s.order,
          transition: s.transition,
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage,
          elements: s.elements,
          mobileElements: s.mobileElements,
        }))
      );
    }

    await tx
      .update(presentations)
      .set({ updatedAt: new Date() })
      .where(eq(presentations.id, id));
  });

  return Response.json({ success: true });
}
