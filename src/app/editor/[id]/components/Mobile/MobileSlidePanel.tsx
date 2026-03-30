"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { SlidePreview } from "@/components/SlidePreview";
import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";
import { useTranslation } from "@/lib/i18n/context";
import { useTouchDrag } from "@/hooks/useSlideDrag";

export function MobileSlidePanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const updateSlideTransition = useEditorStore((s) => s.updateSlideTransition);
  const reorderSlides = useEditorStore((s) => s.reorderSlides);
  const [expandedTr, setExpandedTr] = useState<number | null>(null);

  const { touchDragIndex, touchOverIndex, registerRef, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchDrag({ onReorder: reorderSlides });

  return (
    <div className="p-4 space-y-2">
      {slides.map((slide, i) => (
        <div key={slide.id} className="relative">
          {touchOverIndex === i && touchDragIndex !== i && (
            <div className="absolute inset-x-2 -top-1 z-10 h-1 rounded-full bg-blue-500" />
          )}
          <div
            ref={registerRef(i)}
            onTouchStart={handleTouchStart(i)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden rounded border-2 transition-all ${
              touchDragIndex === i ? "opacity-40 scale-95" : ""
            } ${
              i === activeSlideIndex ? "border-blue-500" : "border-neutral-700"
            }`}
          >
            <button
              onClick={() => { setActiveSlide(i); onClose(); }}
              className="w-full"
            >
              <SlidePreview slide={slide} className="w-full" />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[9px] text-white">
              {i + 1}
            </span>
            {slides.length > 1 && (
              <button
                onClick={() => deleteSlide(slide.id)}
                aria-label={t.editor.deleteSlide}
                className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-xs text-white active:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
          {i < slides.length - 1 && (
            <div className="flex items-center justify-center py-1.5">
              {expandedTr === i ? (
                <div className="flex gap-1 rounded-full bg-neutral-800 px-2 py-1">
                  {TRANSITION_LIST.map((tr) => (
                    <button
                      key={tr}
                      onClick={() => { updateSlideTransition(slides[i + 1].id, tr); setExpandedTr(null); }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                        slides[i + 1].transition === tr
                          ? "bg-white text-[#161616]"
                          : "text-neutral-400 active:bg-neutral-700"
                      }`}
                    >
                      <TransitionIcon type={tr} size={14} />
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setExpandedTr(i)}
                  className="flex h-7 items-center gap-1.5 rounded-full bg-neutral-800/50 px-3 text-neutral-500 active:bg-neutral-700"
                >
                  <TransitionIcon type={slides[i + 1].transition} size={12} />
                  <span className="text-[9px] uppercase tracking-wider">{slides[i + 1].transition}</span>
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() => { addSlide(); onClose(); }}
        className="w-full rounded border border-dashed border-neutral-600 py-2 text-xs text-neutral-400"
      >
        {t.editor.addSlideAction}
      </button>
    </div>
  );
}
