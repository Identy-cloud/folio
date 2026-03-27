"use client";

import { useEditorStore } from "@/store/editorStore";
import { SlideThumb } from "./SlideThumb";

export function SlidePanel() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);

  return (
    <div className="flex w-56 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Slides
        </span>
        <button
          onClick={addSlide}
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          + Añadir
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
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
    </div>
  );
}
