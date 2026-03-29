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
import { useTranslation } from "@/lib/i18n/context";

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
          {t.editor.slides} ({slides.length})
        </span>
        <button
          onClick={addSlide}
          className="text-xs text-neutral-500 hover:text-neutral-200"
        >
          <Plus size={12} className="inline" /> {t.editor.addSlide}
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
            <div className="space-y-0">
              {slides.map((slide, i) => (
                <div key={slide.id}>
                  <SortableSlideThumb
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
                  {i < slides.length - 1 && (
                    <InlineTransitionPicker
                      current={slides[i + 1].transition}
                      onChange={(tr) => updateSlideTransition(slides[i + 1].id, tr)}
                    />
                  )}
                </div>
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
            label={t.editor.duplicateSlide}
            onClick={() => {
              duplicateSlide(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          <CtxItem
            label={t.editor.moveToStart}
            onClick={() => {
              moveSlideToStart(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          <CtxItem
            label={t.editor.moveToEnd}
            onClick={() => {
              moveSlideToEnd(contextMenu.slideId);
              setContextMenu(null);
            }}
          />
          <div className="border-t border-neutral-700">
            <TransitionPicker
              current={slides.find((s) => s.id === contextMenu.slideId)?.transition ?? "fade"}
              onChange={(tr) => updateSlideTransition(contextMenu.slideId, tr)}
            />
          </div>
          {slides.length > 1 && (
            <CtxItem
              label={t.editor.deleteSlide}
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

import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";

function InlineTransitionPicker({
  current,
  onChange,
}: {
  current: string;
  onChange: (t: import("@/types/elements").SlideTransition) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center py-1.5">
      {open ? (
        <div className="flex gap-1 rounded-full bg-neutral-800 px-1.5 py-1">
          {TRANSITION_LIST.map((tr) => (
            <button
              key={tr}
              onClick={() => { onChange(tr); setOpen(false); }}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                current === tr
                  ? "bg-white text-[#161616]"
                  : "text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
              }`}
              title={tr}
            >
              <TransitionIcon type={tr} size={12} />
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex h-6 items-center gap-1.5 rounded-full bg-neutral-800/50 px-2.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
        >
          <TransitionIcon type={current as import("@/types/elements").SlideTransition} size={11} />
          <span className="text-[9px] uppercase tracking-wider opacity-60 group-hover:opacity-100">
            {current === "none" ? "—" : current}
          </span>
        </button>
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
