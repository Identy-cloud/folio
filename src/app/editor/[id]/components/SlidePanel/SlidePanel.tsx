"use client";

import { useRef, useState } from "react";
import { Plus, ArrowSquareIn } from "@phosphor-icons/react";
import { NotesEditor } from "./NotesEditor";
import { ImportSlideModal } from "../ImportSlideModal";
import { useEditorStore } from "@/store/editorStore";
import { SortableSlideThumb } from "./SortableSlideThumb";
import { InlineTransitionPicker, SlideContextMenu } from "./SlidePanelParts";
import { useTranslation } from "@/lib/i18n/context";
import { useSlideDrag, useTouchDrag } from "@/hooks/useSlideDrag";

export function SlidePanel() {
  const { t } = useTranslation();
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide);
  const moveSlideToStart = useEditorStore((s) => s.moveSlideToStart);
  const moveSlideToEnd = useEditorStore((s) => s.moveSlideToEnd);
  const reorderSlides = useEditorStore((s) => s.reorderSlides);
  const updateSlideTransition = useEditorStore((s) => s.updateSlideTransition);
  const parentRef = useRef<HTMLDivElement>(null);
  const [importOpen, setImportOpen] = useState(false);

  function saveSlideToLibrary(slideId: string) {
    const slide = slides.find((s) => s.id === slideId);
    if (!slide) return;
    const textEl = slide.elements.find((e) => e.type === "text");
    const name = textEl && "content" in textEl
      ? textEl.content.replace(/<[^>]*>/g, "").trim().slice(0, 40) || `Slide ${slides.indexOf(slide) + 1}`
      : `Slide ${slides.indexOf(slide) + 1}`;
    fetch("/api/slides/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        elements: slide.elements,
        backgroundColor: slide.backgroundColor,
        backgroundImage: slide.backgroundImage,
        backgroundGradient: slide.backgroundGradient ?? null,
      }),
    });
  }
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; slideId: string;
  } | null>(null);

  const { dragState, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useSlideDrag({ onReorder: reorderSlides });
  const { touchDragIndex, touchOverIndex, registerRef, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchDrag({ onReorder: reorderSlides });

  return (
    <div className="flex h-full w-56 flex-col border-r border-neutral-800 bg-[#161616]">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          {t.editor.slides} ({slides.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="text-neutral-500 hover:text-neutral-200"
            title={t.editor.importSlide ?? "Import slide"}
          >
            <ArrowSquareIn size={14} />
          </button>
          <button onClick={addSlide} className="text-xs text-neutral-500 hover:text-neutral-200">
            <Plus size={12} className="inline" /> {t.editor.addSlide}
          </button>
        </div>
      </div>
      <div ref={parentRef} className="flex-1 overflow-y-auto p-2" onClick={() => setContextMenu(null)}>
        <div className="space-y-0">
          {slides.map((slide, i) => (
            <div key={slide.id}>
              <SortableSlideThumb
                slide={slide}
                index={i}
                isActive={i === activeSlideIndex}
                isDragging={dragState.dragIndex === i || touchDragIndex === i}
                isOver={dragState.overIndex === i || touchOverIndex === i}
                onClick={() => setActiveSlide(i)}
                onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, slideId: slide.id }); }}
                onDelete={slides.length > 1 ? () => deleteSlide(slide.id) : undefined}
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver(i)}
                onDrop={handleDrop(i)}
                onDragEnd={handleDragEnd}
                registerRef={registerRef(i)}
                onTouchStart={handleTouchStart(i)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                isTouchDragging={touchDragIndex === i}
              />
              {i < slides.length - 1 && (
                <InlineTransitionPicker
                  current={slides[i + 1].transition}
                  onChange={(tr) => updateSlideTransition(slides[i + 1].id, tr)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {contextMenu && (
        <SlideContextMenu
          menu={contextMenu}
          slides={slides}
          onDuplicate={duplicateSlide}
          onMoveToStart={moveSlideToStart}
          onMoveToEnd={moveSlideToEnd}
          onAddSlide={addSlide}
          onDelete={deleteSlide}
          onTransition={updateSlideTransition}
          onSaveToLibrary={saveSlideToLibrary}
          onImportSlide={() => setImportOpen(true)}
          onClose={() => setContextMenu(null)}
          labels={{
            duplicate: t.editor.duplicateSlide,
            moveToStart: t.editor.moveToStart,
            moveToEnd: t.editor.moveToEnd,
            delete: t.editor.deleteSlide,
          }}
        />
      )}
      <NotesEditor />
      <ImportSlideModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
