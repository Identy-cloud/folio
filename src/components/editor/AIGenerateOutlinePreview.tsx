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
        <div key={i} className="flex gap-3 rounded border border-steel bg-navy p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/5 text-xs font-medium text-silver/70">
            {i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-white">{slide.title}</p>
              <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-silver/70">
                {LAYOUT_LABELS[slide.layout] ?? slide.layout}
              </span>
            </div>
            {slide.subtitle && (
              <p className="mt-0.5 truncate text-xs text-silver/50">{slide.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
