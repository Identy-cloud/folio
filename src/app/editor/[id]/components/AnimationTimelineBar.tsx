"use client";

import { useCallback } from "react";
import type { SlideElement, ElementAnimation } from "@/types/elements";

const ANIMATION_COLORS: Record<ElementAnimation, string> = {
  none: "#555",
  "fade-up": "#3b82f6",
  "fade-down": "#6366f1",
  "fade-left": "#8b5cf6",
  "fade-right": "#a78bfa",
  "zoom-in": "#f59e0b",
  "zoom-out": "#f97316",
  "rotate-in": "#10b981",
  "bounce-in": "#ec4899",
};

interface Props {
  element: SlideElement;
  pxPerMs: number;
  onDelayChange: (id: string, delay: number) => void;
  onDurationChange: (id: string, duration: number) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export function AnimationTimelineBar({
  element, pxPerMs, onDelayChange, onDurationChange, onSelect, isSelected,
}: Props) {
  const delay = element.animationDelay ?? 0;
  const duration = element.animationDuration ?? 500;
  const animation = element.animation ?? "none";
  const color = ANIMATION_COLORS[animation];
  const label = element.type === "text" && "content" in element
    ? String((element as { content: string }).content).replace(/<[^>]*>/g, "").slice(0, 20) || "text"
    : element.type;

  const startDrag = useCallback((e: React.PointerEvent, mode: "move" | "resize-end") => {
    e.stopPropagation();
    const startX = e.clientX;
    const startDelay = delay;
    const startDuration = duration;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const deltaMs = Math.round(dx / pxPerMs);
      if (mode === "move") {
        onDelayChange(element.id, Math.max(0, startDelay + deltaMs));
      } else {
        onDurationChange(element.id, Math.max(100, startDuration + deltaMs));
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [delay, duration, pxPerMs, element.id, onDelayChange, onDurationChange]);

  return (
    <div
      className={`absolute top-1 h-7 rounded flex items-center cursor-grab active:cursor-grabbing select-none group ${isSelected ? "ring-2 ring-white/60" : ""}`}
      style={{
        left: `${delay * pxPerMs}px`,
        width: `${Math.max(duration * pxPerMs, 20)}px`,
        backgroundColor: color,
      }}
      onPointerDown={(e) => { onSelect(element.id); startDrag(e, "move"); }}
    >
      <span className="truncate px-1.5 text-[10px] font-medium text-white/90 pointer-events-none">
        {label}
      </span>
      <div
        className="absolute right-0 top-0 h-full w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r"
        onPointerDown={(e) => startDrag(e, "resize-end")}
      />
    </div>
  );
}
