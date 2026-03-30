import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getUserPlan } from "@/lib/stripe";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { SlideElement, SlideTransition, TransitionEasing } from "@/types/elements";
import type { Metadata } from "next";
import { EmbedViewer } from "./embed-viewer";

interface SlideRow {
  id: string;
  presentationId: string;
  order: number;
  transition: SlideTransition;
  transitionDuration?: number;
  transitionEasing?: TransitionEasing;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}

async function getData(slug: string) {
  const [pres] = await db
    .select()
    .from(presentations)
    .where(eq(presentations.slug, slug))
    .limit(1);

  if (!pres || !pres.isPublic) return null;

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, pres.id))
    .orderBy(asc(slides.order));

  const ownerPlan = await getUserPlan(pres.userId);

  return { pres, slideRows, ownerPlan };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) return { title: "Not found" };
  return {
    title: `${data.pres.title} — Folio`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autoplay?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const data = await getData(slug);
  if (!data) notFound();

  const autoplay = sp.autoplay === "1";

  const mappedSlides: SlideRow[] = data.slideRows.map((s) => ({
    id: s.id,
    presentationId: s.presentationId,
    order: s.order,
    transition: (s.transition as SlideTransition) ?? "fade",
    transitionDuration: s.transitionDuration ?? undefined,
    transitionEasing: (s.transitionEasing as TransitionEasing) ?? undefined,
    backgroundColor: s.backgroundColor,
    backgroundImage: s.backgroundImage,
    elements: s.elements as SlideElement[],
    mobileElements: s.mobileElements as SlideElement[] | null,
  }));

  return (
    <EmbedViewer
      title={data.pres.title}
      slides={mappedSlides}
      showWatermark={data.ownerPlan === "free"}
      presentationId={data.pres.id}
      hasPassword={!!data.pres.password}
      autoplay={autoplay}
    />
  );
}
