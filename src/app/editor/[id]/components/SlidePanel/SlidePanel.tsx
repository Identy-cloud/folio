"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEditorStore } from "@/store/editorStore";
import { SortableSlideThumb } from "./SortableSlideThumb";

const THUMB_HEIGHT = 136;
const VIRTUALIZATION_THRESHOLD = 20;

export function SlidePanel() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide);
  const moveSlideToStart = useEditorStore((s) => s.moveSlideToStart);
  const moveSlideToEnd = useEditorStore((s) => s.moveSlideToEnd);
  const reorderSlides = useEditorStore((s) => s.reorderSlides);
  const parentRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    slideId: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = slides.findIndex((s) => s.id === active.id);
    const to = slides.findIndex((s) => s.id === over.id);
    if (from >= 0 && to >= 0) reorderSlides(from, to);
  }

  function handleContextMenu(e: React.MouseEvent, slideId: string) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, slideId });
  }

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
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto p-2"
        onClick={() => setContextMenu(null)}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {slides.map((slide, i) => (
                <SortableSlideThumb
                  key={slide.id}
                  slide={slide}
                  index={i}
                  isActive={i === activeSlideIndex}
                  onClick={() => setActiveSlide(i)}
                  onContextMenu={(e) => handleContextMenu(e, slide.id)}
                  onDelete={
                    slides.length > 1
                      ? () => deleteSlide(slide.id)
                      : undefined
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 w-44 rounded border border-neutral-200 bg-white py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <CtxItem
            label="Duplicar slide"
            onClick={() => {
              duplicateSlide(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          <CtxItem
            label="Mover al inicio"
            onClick={() => {
              moveSlideToStart(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          <CtxItem
            label="Mover al final"
            onClick={() => {
              moveSlideToEnd(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          {slides.length > 1 && (
            <CtxItem
              label="Eliminar slide"
              destructive
              onClick={() => {
                deleteSlide(contextMenu.slideId);
                setContextMenu(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function CtxItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-xs hover:bg-neutral-50 ${
        destructive ? "text-red-600" : "text-neutral-700"
      }`}
    >
      {label}
    </button>
  );
}
