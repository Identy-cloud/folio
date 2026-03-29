import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ViewerWrapper } from "@/app/p/[slug]/viewer-wrapper";
import type { SlideElement, SlideTransition } from "@/types/elements";

interface SlideRow {
  id: string;
  presentationId: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(eq(presentations.slug, slug))
    .limit(1);

  if (!pres || !pres.isPublic) notFound();

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, pres.id))
    .orderBy(asc(slides.order));

  const mappedSlides = slideRows.map((s) => ({
    id: s.id,
    presentationId: s.presentationId,
    order: s.order,
    transition: (s.transition as SlideTransition) ?? "fade",
    backgroundColor: s.backgroundColor,
    backgroundImage: s.backgroundImage,
    elements: s.elements as SlideElement[],
    mobileElements: s.mobileElements as SlideElement[] | null,
  }));

  return (
    <ViewerWrapper
      title={pres.title}
      slides={mappedSlides as SlideRow[]}
      showWatermark={true}
    />
  );
}
