import { memo } from "react";
import type { ArrowElement } from "@/types/elements";

export const ArrowRenderer = memo(function ArrowRenderer({ element }: { element: ArrowElement }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[element.direction];
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ transform: `rotate(${rotate}deg)` }}>
      <line x1="0" y1="25" x2="85" y2="25" stroke={element.color} strokeWidth={element.strokeWidth} />
      <polygon points="85,10 100,25 85,40" fill={element.color} />
    </svg>
  );
});
