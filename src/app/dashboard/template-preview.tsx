"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { TemplateDefinition } from "@/lib/templates/template-types";
import { THEMES } from "@/lib/templates/themes";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { Slide } from "@/types/elements";
import { SlidePreviewMini } from "./slide-preview-mini";

interface Props {
  template: TemplateDefinition;
  onConfirm: () => void;
}

const PREVIEW_THEME = "editorial-blue";

export function TemplatePreview({ template, onConfirm }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const slides = useMemo(() => {
    const theme = THEMES[PREVIEW_THEME];
    if (!theme) return [];
    return template.generate(theme, PREVIEW_THEME, "preview");
  }, [template]);

  const total = slides.length;
  const currentSlide = slides[current] as Omit<Slide, "id"> | undefined;

  function goTo(idx: number) {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 150);
  }

  useEffect(() => {
    const el = thumbRefs.current[current];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex-1">
          <div
            className="relative aspect-video w-full overflow-hidden border border-steel"
            style={{ backgroundColor: currentSlide?.backgroundColor ?? "#1e1e1e" }}
          >
            <div className="absolute inset-0 transition-opacity duration-150" style={{ opacity: fading ? 0 : 1 }}>
              <SlidePreviewMini slide={currentSlide} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col lg:w-72">
          <h3 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {template.name}
          </h3>
          <span className="mt-2 self-start bg-white/5 px-2.5 py-1 text-xs capitalize text-silver/70">
            {template.category}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-silver/70">
            {template.description}
          </p>
          <p className="mt-2 text-sm text-silver/50">
            {template.slideCount} slides
          </p>
          <button
            onClick={onConfirm}
            className="mt-6 w-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover lg:mt-auto"
          >
            Use this template
          </button>
        </div>
      </div>

      <div ref={thumbsRef} className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {slides.map((s, i) => (
          <button
            key={i}
            ref={(el) => { thumbRefs.current[i] = el; }}
            onClick={() => goTo(i)}
            className={`relative shrink-0 overflow-hidden border transition-all duration-200 ${
              i === current
                ? "border-white/40 ring-1 ring-white/20"
                : "border-steel opacity-60 hover:opacity-100"
            }`}
            style={{ width: 120, height: 68, backgroundColor: s.backgroundColor }}
          >
            <SlidePreviewMini slide={s} />
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(Math.max(0, current - 1))}
          disabled={current === 0}
          className="p-1.5 text-silver/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs tabular-nums text-silver/70">
          {current + 1} / {total}
        </span>
        <button
          onClick={() => goTo(Math.min(total - 1, current + 1))}
          disabled={current === total - 1}
          className="p-1.5 text-silver/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
