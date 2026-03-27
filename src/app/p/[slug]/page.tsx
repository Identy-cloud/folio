import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ViewerClient } from "./viewer-client";
import type { SlideElement } from "@/types/elements";

interface SlideRow {
  id: string;
  presentationId: string;
  order: number;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
}

async function getPresentation(slug: string) {
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

  return {
    presentation: pres,
    slides: slideRows.map((s) => ({
      id: s.id,
      presentationId: s.presentationId,
      order: s.order,
      backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      elements: s.elements as SlideElement[],
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPresentation(slug);
  if (!data) return { title: "No encontrado" };

  return {
    title: data.presentation.title,
    openGraph: {
      title: data.presentation.title,
      images: data.presentation.thumbnailUrl
        ? [data.presentation.thumbnailUrl]
        : [],
      type: "website",
    },
  };
}

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPresentation(slug);
  if (!data) notFound();

  return (
    <ViewerClient
      title={data.presentation.title}
      slides={data.slides as SlideRow[]}
    />
  );
}
