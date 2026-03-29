"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Eye } from "@phosphor-icons/react";
import type { SlideElement, SlideTransition } from "@/types/elements";

const ViewerClient = dynamic(
  () => import("@/app/p/[slug]/viewer-client").then((m) => m.ViewerClient),
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
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId: string;
  editorUrl: string;
}

export function PreviewClient({ title, slides, showWatermark, presentationId, editorUrl }: Props) {
  return (
    <div className="relative h-screen w-screen">
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-10 items-center justify-between bg-amber-600/90 px-3 backdrop-blur-sm sm:px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-black">
          <Eye size={14} weight="bold" />
          <span>PREVIEW MODE</span>
          <span className="hidden sm:inline text-black/60">— {title}</span>
        </div>
        <Link
          href={editorUrl}
          className="flex items-center gap-1.5 rounded bg-black/20 px-3 py-1 text-xs font-medium text-black hover:bg-black/30 transition-colors"
        >
          <ArrowLeft size={12} weight="bold" />
          Back to editor
        </Link>
      </div>

      {/* Viewer with top padding for banner */}
      <div className="h-full pt-10">
        <ViewerClient
          title={title}
          slides={slides}
          showWatermark={showWatermark}
          presentationId={presentationId}
          hasPassword={false}
        />
      </div>
    </div>
  );
}
