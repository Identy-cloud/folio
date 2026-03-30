"use client";

import type { GeneratedSlide } from "@/app/api/ai/generate-presentation/route";

interface Props {
  slides: GeneratedSlide[];
}

const LAYOUT_LABELS: Record<string, string> = {
  "title": "Title",
  "title-content": "Content",
  "two-columns": "Two Cols",
  "image-text": "Img + Text",
  "quote": "Quote",
  "section-header": "Section",
};

export function AIGenerateOutlinePreview({ slides }: Props) {
  return (
    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
      {slides.map((slide, i) => (
        <div key={i} className="flex gap-3 rounded border border-neutral-700 bg-neutral-900 p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-800 text-xs font-medium text-neutral-400">
            {i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-white">{slide.title}</p>
              <span className="shrink-0 rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400">
                {LAYOUT_LABELS[slide.layout] ?? slide.layout}
              </span>
            </div>
            {slide.subtitle && (
              <p className="mt-0.5 truncate text-xs text-neutral-500">{slide.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
