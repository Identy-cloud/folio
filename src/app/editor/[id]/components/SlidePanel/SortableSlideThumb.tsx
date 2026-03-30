"use client";

import { memo } from "react";
import { X } from "@phosphor-icons/react";
import type { Slide } from "@/types/elements";
import { SlidePreview } from "@/components/SlidePreview";

interface Props {
  slide: Slide;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  isOver: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  registerRef?: (el: HTMLElement | null) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  isTouchDragging?: boolean;
}

export const SortableSlideThumb = memo(function SortableSlideThumb({
  slide,
  index,
  isActive,
  isDragging,
  isOver,
  onClick,
  onContextMenu,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  registerRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isTouchDragging,
}: Props) {
  const setRef = (el: HTMLDivElement | null) => {
    registerRef?.(el);
  };

  return (
    <div className="relative">
      {isOver && !isDragging && (
        <div className="absolute inset-x-1 -top-0.5 z-10 h-1 rounded-full bg-blue-500" />
      )}
      <div
        ref={setRef}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`group relative cursor-grab rounded border-2 transition-all active:cursor-grabbing ${
          isDragging || isTouchDragging ? "opacity-40 scale-95" : "opacity-100"
        } ${
          isActive
            ? "border-blue-500"
            : "border-transparent hover:border-neutral-600"
        }`}
      >
        <SlidePreview slide={slide} className="w-full rounded-sm" />
        <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[10px] text-white">
          {index + 1}
        </span>
        <span className="absolute top-1 right-1 rounded bg-black/40 px-1 text-[10px] text-white/50">
          {slide.elements.length}
        </span>
        {slide.duration && slide.duration > 0 && (
          <span
            className="absolute bottom-1 left-1 rounded bg-blue-500/30 px-1 text-[10px] text-blue-300"
            title={`Auto-advance: ${slide.duration}s`}
          >
            {slide.duration}s
          </span>
        )}
        {slide.notes && slide.notes.trim().length > 0 && (
          <span
            className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500"
            title="Has notes"
          />
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded bg-red-500 text-white hover:bg-red-600 transition-colors group-hover:flex"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
});
