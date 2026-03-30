"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { SlideElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";
import { SlidePreview } from "@/components/SlidePreview";

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  transitionDuration?: number;
  transitionEasing?: TransitionEasing;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  slug: string;
  slides: Slide[];
  initialSlide: number;
}

export function AudienceView({ slug, slides, initialSlide }: Props) {
  const [current, setCurrent] = useState(initialSlide);
  const [connected, setConnected] = useState(false);

  const onMessage = useCallback(
    (msg: { type: string; slide?: number }) => {
      if (msg.type === "slide-change" && typeof msg.slide === "number") {
        setCurrent(msg.slide);
      }
      if (msg.type === "presenter-connected") {
        setConnected(true);
      }
      if (msg.type === "presenter-disconnected") {
        setConnected(false);
      }
    },
    [],
  );

  const { isSupported } = useBroadcastChannel(
    `folio-presenter-${slug}`,
    onMessage,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key === "Escape") {
        document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!isSupported) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-sm text-white/50">
          Your browser does not support dual-screen presenting.
        </p>
      </div>
    );
  }

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      <SlidePreview slide={slide} className="h-full w-full" />
      {!connected && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="rounded bg-black/60 px-3 py-1.5 text-[10px] text-white/40 backdrop-blur-sm">
            Waiting for presenter...
          </span>
        </div>
      )}
    </div>
  );
}
