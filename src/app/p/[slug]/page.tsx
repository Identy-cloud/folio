import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getUserPlan } from "@/lib/stripe";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ViewerWrapper } from "./viewer-wrapper";
import { ExpiredLink } from "./expired-link";
import type { SlideElement, SlideTransition, TransitionEasing } from "@/types/elements";

interface MappedSlide {
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

type PresentationResult =
  | { status: "ok"; presentation: typeof presentations.$inferSelect; ownerPlan: string; slides: MappedSlide[] }
  | { status: "expired" }
  | { status: "not_found" };

async function getPresentation(slug: string, token?: string): Promise<PresentationResult> {
  const [pres] = await db
    .select()
    .from(presentations)
    .where(eq(presentations.slug, slug))
    .limit(1);

  if (!pres) return { status: "not_found" };

  const hasTokenAccess = !!token && !!pres.shareToken && token === pres.shareToken;

  if (!pres.isPublic && !hasTokenAccess) return { status: "not_found" };

  if (pres.shareExpiresAt && new Date(pres.shareExpiresAt) < new Date()) {
    return { status: "expired" };
  }

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, pres.id))
    .orderBy(asc(slides.order));

  const ownerPlan = await getUserPlan(pres.userId);

  return {
    status: "ok",
    presentation: pres,
    ownerPlan,
    slides: slideRows.map((s) => ({
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
  if (data.status !== "ok") return { title: "No encontrado" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const description = `${data.presentation.title} — Presentación creada con Folio`;

  return {
    title: data.presentation.title,
    description,
    openGraph: {
      title: data.presentation.title,
      description,
      images: [`${appUrl}/api/og/${slug}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.presentation.title,
      description,
      images: [`${appUrl}/api/og/${slug}`],
    },
  };
}

export default async function ViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : undefined;
  const data = await getPresentation(slug, token);

  if (data.status === "expired") {
    return <ExpiredLink />;
  }

  if (data.status !== "ok") notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PresentationDigitalDocument",
    name: data.presentation.title,
    url: `${appUrl}/p/${slug}`,
    dateModified: data.presentation.updatedAt,
    datePublished: data.presentation.createdAt,
    image: `${appUrl}/api/og/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Folio",
      url: appUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewerWrapper
        title={data.presentation.title}
        slug={slug}
        slides={data.slides}
        showWatermark={data.ownerPlan === "free"}
        presentationId={data.presentation.id}
        hasPassword={!!data.presentation.password}
        forkCount={data.presentation.forkCount}
        recordingUrl={data.presentation.recordingUrl ?? undefined}
        recordingTimeline={data.presentation.recordingTimeline as { slideIndex: number; startTime: number }[] | undefined}
        recordingDuration={data.presentation.recordingDuration ?? undefined}
      />
    </>
  );
}
