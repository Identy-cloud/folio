"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SlideElement, SlideTransition, GradientDef } from "@/types/elements";
import { useViewerFonts } from "@/hooks/useViewerFonts";
import { EmbedSlideLayer } from "./embed-slide-layer";
import { EmbedPasswordGate } from "./embed-password-gate";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId: string;
  hasPassword: boolean;
  autoplay: boolean;
}

export function EmbedViewer({ title, slides, showWatermark, presentationId, hasPassword, autoplay: initialAutoplay }: Props) {
  useViewerFonts(presentationId);
  const [unlocked, setUnlocked] = useState(!hasPassword);
  const [current, setCurrent] = useState(0);
  const [slideHistory, setSlideHistory] = useState<number[]>([]);
  const [scale, setScale] = useState(1);
  const [playing, setPlaying] = useState(initialAutoplay);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;
    const vh = containerRef.current.clientHeight;
    setScale(Math.min(vw / SLIDE_W, vh / SLIDE_H));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  const goNext = useCallback(() => setCurrent((c) => (c < total - 1 ? c + 1 : 0)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : total - 1)), [total]);

  const jumpToSlide = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= total || targetIndex === current) return;
    setSlideHistory((h) => [...h, current]);
    setCurrent(targetIndex);
  }, [total, current]);

  const goBackFromJump = useCallback(() => {
    setSlideHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setCurrent(prev);
      return h.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!playing) { if (autoplayRef.current) clearTimeout(autoplayRef.current); return; }
    autoplayRef.current = setTimeout(() => {
      setCurrent((c) => (c < total - 1 ? c + 1 : 0));
    }, ((slides[current] as { duration?: number })?.duration ?? 5) * 1000);
    return () => { if (autoplayRef.current) clearTimeout(autoplayRef.current); };
  }, [playing, current, total, slides]);

  if (!unlocked) {
    return <EmbedPasswordGate presentationId={presentationId} onUnlock={() => setUnlocked(true)} />;
  }

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black select-none"
    >
      <EmbedSlideLayer slide={slide} scale={scale} onSlideJump={jumpToSlide} />

      {/* Back button after non-linear jump */}
      {slideHistory.length > 0 && (
        <button
          onClick={goBackFromJump}
          className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back
        </button>
      )}

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/60 hover:bg-black/60 hover:text-white transition-colors md:left-3 md:p-2"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" /></svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/60 hover:bg-black/60 hover:text-white transition-colors md:right-3 md:p-2"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
          </button>
        </>
      )}

      {/* Slide counter */}
      <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white/60 tabular-nums backdrop-blur-sm">
        {current + 1} / {total}
      </div>

      {/* Autoplay toggle */}
      <button
        onClick={() => setPlaying((v) => !v)}
        className="absolute bottom-2 right-2 z-10 rounded-full bg-black/50 px-2 py-1 text-[10px] text-white/50 hover:text-white/80 backdrop-blur-sm transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Watermark */}
      {showWatermark && (
        <a
          href={typeof window !== "undefined" ? window.location.origin : "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 z-10 rounded bg-black/40 px-2 py-0.5 text-[9px] tracking-[0.15em] text-white/40 uppercase backdrop-blur-sm hover:text-white/60 transition-colors"
        >
          Folio
        </a>
      )}
    </div>
  );
}
