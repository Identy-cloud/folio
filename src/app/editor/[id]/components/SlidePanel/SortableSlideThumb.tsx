"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "@phosphor-icons/react";
import type { Slide } from "@/types/elements";
import { SlidePreview } from "@/components/SlidePreview";

interface Props {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDelete?: () => void;
}

export const SortableSlideThumb = memo(function SortableSlideThumb({
  slide,
  index,
  isActive,
  onClick,
  onContextMenu,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group relative cursor-pointer rounded border-2 transition-colors ${
        isActive
          ? "border-blue-500"
          : "border-transparent hover:border-neutral-600"
      }`}
    >
      <SlidePreview slide={slide} className="w-full rounded-sm" />
      <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[9px] text-white">
        {index + 1}
      </span>
      <span className="absolute top-1 right-1 rounded bg-black/40 px-1 text-[8px] text-white/50">
        {slide.elements.length}
      </span>
      {slide.notes && slide.notes.trim().length > 0 && (
        <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" title="Has notes" />
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-1 top-1 hidden rounded bg-red-500 p-0.5 text-white group-hover:block"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
});
