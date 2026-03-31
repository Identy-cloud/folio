"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { SlideElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";

const ViewerClient = dynamic(
  () => import("./viewer-client").then((m) => m.ViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen flex-col items-center justify-center bg-black gap-4">
        <span className="font-display text-2xl tracking-tight text-white/20">FOLIO</span>
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-steel border-t-neutral-400" />
      </div>
    ),
  }
);

const AudienceView = dynamic(
  () => import("./audience-view").then((m) => m.AudienceView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen flex-col items-center justify-center bg-black gap-4">
        <span className="font-display text-2xl tracking-tight text-white/20">FOLIO</span>
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-steel border-t-neutral-400" />
      </div>
    ),
  }
);

interface Slide {
  id: string;
  presentationId: string;
  order: number;
  transition: SlideTransition;
  transitionDuration?: number;
  transitionEasing?: TransitionEasing;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}

interface TimelineEntry {
  slideIndex: number;
  startTime: number;
}

interface Props {
  title: string;
  slug: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId?: string;
  hasPassword?: boolean;
  forkCount?: number;
  recordingUrl?: string;
  recordingTimeline?: TimelineEntry[];
  recordingDuration?: number;
}

export function ViewerWrapper({ title, slug, slides, showWatermark, presentationId, hasPassword, forkCount, recordingUrl, recordingTimeline, recordingDuration }: Props) {
  const searchParams = useSearchParams();
  const isPresenterMode = searchParams.get("presenter") === "true";
  const initialSlide = parseInt(searchParams.get("slide") ?? "0", 10);

  if (isPresenterMode) {
    return (
      <AudienceView
        slug={slug}
        slides={slides}
        initialSlide={isNaN(initialSlide) ? 0 : initialSlide}
      />
    );
  }

  return <ViewerClient title={title} slides={slides} showWatermark={showWatermark} presentationId={presentationId} hasPassword={hasPassword} forkCount={forkCount} recordingUrl={recordingUrl} recordingTimeline={recordingTimeline} recordingDuration={recordingDuration} />;
}
