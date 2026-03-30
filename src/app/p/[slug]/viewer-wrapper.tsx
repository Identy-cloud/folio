"use client";

import dynamic from "next/dynamic";
import type { SlideElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";

const ViewerClient = dynamic(
  () => import("./viewer-client").then((m) => m.ViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen flex-col items-center justify-center bg-black gap-4">
        <span className="font-display text-2xl tracking-tight text-white/20">FOLIO</span>
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
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

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId?: string;
  hasPassword?: boolean;
}

export function ViewerWrapper({ title, slides, showWatermark, presentationId, hasPassword }: Props) {
  return <ViewerClient title={title} slides={slides} showWatermark={showWatermark} presentationId={presentationId} hasPassword={hasPassword} />;
}
