"use client";

import { useState, useMemo } from "react";
import type { TemplateDefinition } from "@/lib/templates/template-types";
import { THEMES } from "@/lib/templates/themes";
import { ArrowLeft, ArrowRight, CaretLeft } from "@phosphor-icons/react";
import type { Slide } from "@/types/elements";
import { SlidePreviewMini } from "./slide-preview-mini";

interface Props {
  template: TemplateDefinition;
  onBack: () => void;
  onConfirm: () => void;
}

const PREVIEW_THEME = "editorial-blue";

export function TemplatePreview({ template, onBack, onConfirm }: Props) {
  const [current, setCurrent] = useState(0);

  const slides = useMemo(() => {
    const theme = THEMES[PREVIEW_THEME];
    if (!theme) return [];
    return template.generate(theme, PREVIEW_THEME, "preview");
  }, [template]);

  const total = slides.length;
  const currentSlide = slides[current] as Omit<Slide, "id"> | undefined;

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <CaretLeft size={14} />
        Back to templates
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex-1">
          <div
            className="relative aspect-video w-full overflow-hidden rounded border border-neutral-700"
            style={{ backgroundColor: currentSlide?.backgroundColor ?? "#1e1e1e" }}
          >
            <SlidePreviewMini slide={currentSlide} />
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrent((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs tabular-nums text-neutral-400">
              {current + 1} / {total}
            </span>
            <button
              onClick={() => setCurrent((p) => Math.min(total - 1, p + 1))}
              disabled={current === total - 1}
              className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-30"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-72">
          <h3 className="font-display text-2xl tracking-tight text-white">
            {template.name}
          </h3>
          <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[10px] capitalize text-neutral-400">
            {template.category}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {template.description}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            {template.slideCount} slides
          </p>
          <button
            onClick={onConfirm}
            className="mt-6 w-full rounded bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Use this template
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative shrink-0 overflow-hidden rounded border transition-all ${
              i === current
                ? "border-white/40 ring-1 ring-white/20"
                : "border-neutral-700 opacity-60 hover:opacity-100"
            }`}
            style={{ width: 120, height: 68, backgroundColor: s.backgroundColor }}
          >
            <SlidePreviewMini slide={s} />
          </button>
        ))}
      </div>
    </div>
  );
}
