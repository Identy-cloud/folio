"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEditorStore } from "@/store/editorStore";
import { SlideThumb } from "./SlideThumb";

const THUMB_HEIGHT = 136;
const VIRTUALIZATION_THRESHOLD = 20;

export function SlidePanel() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const parentRef = useRef<HTMLDivElement>(null);

  const useVirtual = slides.length > VIRTUALIZATION_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: slides.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => THUMB_HEIGHT,
    enabled: useVirtual,
  });

  return (
    <div className="flex w-56 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Slides ({slides.length})
        </span>
        <button
          onClick={addSlide}
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          + Añadir
        </button>
      </div>
      <div ref={parentRef} className="flex-1 overflow-y-auto p-2">
        {useVirtual ? (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((vItem) => {
              const slide = slides[vItem.index];
              return (
                <div
                  key={slide.id}
                  style={{
                    position: "absolute",
                    top: vItem.start,
                    left: 0,
                    right: 0,
                    height: vItem.size,
                    padding: "4px 0",
                  }}
                >
                  <SlideThumb
                    slide={slide}
                    index={vItem.index}
                    isActive={vItem.index === activeSlideIndex}
                    onClick={() => setActiveSlide(vItem.index)}
                    onDelete={
                      slides.length > 1
                        ? () => deleteSlide(slide.id)
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {slides.map((slide, i) => (
              <SlideThumb
                key={slide.id}
                slide={slide}
                index={i}
                isActive={i === activeSlideIndex}
                onClick={() => setActiveSlide(i)}
                onDelete={
                  slides.length > 1 ? () => deleteSlide(slide.id) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
