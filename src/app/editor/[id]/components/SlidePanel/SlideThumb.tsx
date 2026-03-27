"use client";

import { memo } from "react";
import type { Slide } from "@/types/elements";

interface Props {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export const SlideThumb = memo(function SlideThumb({ slide, index, isActive, onClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded border-2 transition-colors ${
        isActive ? "border-blue-500" : "border-transparent hover:border-neutral-300"
      }`}
    >
      <div
        className="aspect-video w-full rounded-sm"
        style={{ backgroundColor: slide.backgroundColor }}
      >
        <div className="flex h-full items-center justify-center">
          <span className="text-[8px] text-neutral-400">
            {slide.elements.length > 0
              ? `${slide.elements.length} elementos`
              : "Vacío"}
          </span>
        </div>
      </div>
      <span className="absolute bottom-1 left-1 text-[9px] text-neutral-400">
        {index + 1}
      </span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-1 top-1 hidden rounded bg-red-500 px-1 text-[9px] text-white group-hover:block"
        >
          ×
        </button>
      )}
    </div>
  );
});
