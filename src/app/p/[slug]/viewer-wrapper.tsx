"use client";

import dynamic from "next/dynamic";
import type { SlideElement, SlideTransition } from "@/types/elements";

const ViewerClient = dynamic(
  () => import("./viewer-client").then((m) => m.ViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-xs text-neutral-500">Cargando presentación...</p>
      </div>
    ),
  }
);

interface Slide {
  id: string;
  presentationId: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
}

export function ViewerWrapper({ title, slides }: Props) {
  return <ViewerClient title={title} slides={slides} />;
}
