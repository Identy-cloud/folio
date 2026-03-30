"use client";

import { useEditorStore } from "@/store/editorStore";
import { SlidePreview } from "@/components/SlidePreview";
import { X, Trash } from "@phosphor-icons/react";
import { useSlideDrag } from "@/hooks/useSlideDrag";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SlideSorter({ open, onClose }: Props) {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide);
  const reorderSlides = useEditorStore((s) => s.reorderSlides);

  const { dragState, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useSlideDrag({ onReorder: reorderSlides });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-3">
        <h2 className="font-display text-xl tracking-tight text-white">
          SLIDE SORTER — {slides.length} slides
        </h2>
        <button onClick={onClose} className="rounded p-2 text-neutral-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              draggable
              onDragStart={handleDragStart(i)}
              onDragOver={handleDragOver(i)}
              onDrop={handleDrop(i)}
              onDragEnd={handleDragEnd}
              onClick={() => { setActiveSlide(i); onClose(); }}
              className={`group relative cursor-grab rounded border-2 transition-all active:cursor-grabbing ${
                dragState.dragIndex === i ? "opacity-40 scale-95" : "opacity-100 hover:scale-[1.02]"
              } ${
                dragState.overIndex === i && dragState.dragIndex !== i
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : i === activeSlideIndex
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              <SlidePreview slide={slide} className="w-full" />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-black/60 px-2 py-1">
                <span className="text-[10px] font-medium text-white">{i + 1}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }}
                    className="text-[9px] text-neutral-400 hover:text-white"
                  >
                    Dup
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <Trash size={10} />
                    </button>
                  )}
                </div>
              </div>
              {slide.notes && slide.notes.trim() && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
