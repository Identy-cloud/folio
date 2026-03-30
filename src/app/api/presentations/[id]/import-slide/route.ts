import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, and, asc, ne, gte, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const otherPres = await db
    .select({ id: presentations.id, title: presentations.title })
    .from(presentations)
    .where(and(eq(presentations.userId, user.id), ne(presentations.id, id)));

  const result = [];
  for (const pres of otherPres) {
    const presSlides = await db
      .select({
        id: slides.id,
        order: slides.order,
        backgroundColor: slides.backgroundColor,
        backgroundGradient: slides.backgroundGradient,
        elements: slides.elements,
      })
      .from(slides)
      .where(eq(slides.presentationId, pres.id))
      .orderBy(asc(slides.order));

    result.push({
      id: pres.id,
      title: pres.title,
      slides: presSlides,
    });
  }

  return Response.json(result);
}

interface ImportBody {
  sourcePresentationId: string;
  sourceSlideIndex: number;
  targetSlideIndex: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id: targetId } = await params;
  const body = (await request.json()) as ImportBody;
  const { sourcePresentationId, sourceSlideIndex, targetSlideIndex } = body;

  const [targetPres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(and(eq(presentations.id, targetId), eq(presentations.userId, user.id)))
    .limit(1);
  if (!targetPres) return Response.json({ error: "Target not found" }, { status: 404 });

  const [sourcePres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(and(eq(presentations.id, sourcePresentationId), eq(presentations.userId, user.id)))
    .limit(1);
  if (!sourcePres) return Response.json({ error: "Source not found" }, { status: 404 });

  const sourceSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, sourcePresentationId))
    .orderBy(asc(slides.order));

  if (sourceSlideIndex < 0 || sourceSlideIndex >= sourceSlides.length) {
    return Response.json({ error: "Invalid source slide index" }, { status: 400 });
  }

  const srcSlide = sourceSlides[sourceSlideIndex];

  await db
    .update(slides)
    .set({ order: sql`${slides.order} + 1` })
    .where(and(eq(slides.presentationId, targetId), gte(slides.order, targetSlideIndex)));

  const elements = Array.isArray(srcSlide.elements) ? srcSlide.elements : [];
  const mobileElements = Array.isArray(srcSlide.mobileElements) ? srcSlide.mobileElements : null;

  const [inserted] = await db
    .insert(slides)
    .values({
      presentationId: targetId,
      order: targetSlideIndex,
      backgroundColor: srcSlide.backgroundColor,
      backgroundGradient: srcSlide.backgroundGradient,
      backgroundImage: srcSlide.backgroundImage,
      transition: srcSlide.transition,
      transitionDuration: srcSlide.transitionDuration,
      transitionEasing: srcSlide.transitionEasing,
      elements: elements,
      mobileElements: mobileElements,
      notes: srcSlide.notes,
    })
    .returning({ id: slides.id });

  return Response.json({ id: inserted.id, order: targetSlideIndex });
}
