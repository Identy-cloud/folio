"use client";

import { useState, useEffect, useCallback } from "react";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideElement } from "@/types/elements";

interface Slide {
  id: string;
  order: number;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  notes: string;
}

interface Props {
  title: string;
  slides: Slide[];
  slug: string;
}

export function PresenterClient({ title, slides, slug }: Props) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const currentSlide = slides[current];
  const nextSlide = slides[current + 1];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Main slide */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
          <span className="text-xs text-neutral-400">{title}</span>
          <span className="text-xs text-neutral-500">
            {current + 1} / {total}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          {currentSlide && (
            <SlidePreview
              slide={currentSlide}
              className="w-full max-w-4xl border border-neutral-800"
            />
          )}
        </div>
      </div>

      {/* Sidebar: next slide + notes */}
      <div className="flex w-80 flex-col border-l border-neutral-800 lg:w-96">
        {/* Next slide preview */}
        <div className="border-b border-neutral-800 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Next
          </p>
          {nextSlide ? (
            <SlidePreview
              slide={nextSlide}
              className="w-full border border-neutral-800 opacity-70"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded bg-neutral-900 text-xs text-neutral-600">
              End
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Notes
          </p>
          {currentSlide?.notes ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
              {currentSlide.notes}
            </p>
          ) : (
            <p className="text-xs italic text-neutral-600">No notes for this slide</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="rounded bg-neutral-800 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener"
            className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Open viewer ↗
          </a>
          <button
            onClick={goNext}
            disabled={current === total - 1}
            className="rounded bg-neutral-800 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
