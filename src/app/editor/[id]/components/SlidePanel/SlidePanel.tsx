"use client";

import { useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
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
import { useEditorStore } from "@/store/editorStore";
import { SortableSlideThumb } from "./SortableSlideThumb";
import { TransitionPicker } from "./TransitionPicker";

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
  const updateSlideTransition = useEditorStore((s) => s.updateSlideTransition);
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

  return (
    <div className="flex w-56 flex-col border-r border-neutral-800 bg-[#161616]">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Slides ({slides.length})
        </span>
        <button
          onClick={addSlide}
          className="text-xs text-neutral-500 hover:text-neutral-200"
        >
          <Plus size={12} className="inline" /> Añadir
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
          className="fixed z-50 w-44 rounded border border-neutral-700 bg-[#242424] py-1 shadow-lg"
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
          <div className="border-t border-neutral-700">
            <TransitionPicker
              current={slides.find((s) => s.id === contextMenu.slideId)?.transition ?? "fade"}
              onChange={(t) => updateSlideTransition(contextMenu.slideId, t)}
            />
          </div>
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
      className={`block w-full px-4 py-2 text-left text-xs hover:bg-neutral-800 ${
        destructive ? "text-red-500" : "text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
