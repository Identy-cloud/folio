import { memo } from "react";
import type { ShapeElement } from "@/types/elements";

function fillStyle(fill: string): React.CSSProperties {
  if (fill.startsWith("linear-gradient") || fill.startsWith("radial-gradient")) {
    return { background: fill };
  }
  return { backgroundColor: fill };
}

const SVG_SHAPES: Record<string, string> = {
  triangle: "50,0 100,100 0,100",
  diamond: "50,0 100,50 50,100 0,50",
  pentagon: "50,0 97.6,34.5 79.4,90.5 20.6,90.5 2.4,34.5",
  hexagon: "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25",
  star: "50,0 61.8,35.1 100,38.2 70.9,60.9 79.4,97.6 50,78 20.6,97.6 29.1,60.9 0,38.2 38.2,35.1",
};

export const ShapeRenderer = memo(function ShapeRenderer({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          ...fillStyle(element.fill),
          border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
        }}
      />
    );
  }

  if (element.shape === "rect") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          ...fillStyle(element.fill),
          borderRadius: element.borderRadius,
          border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
        }}
      />
    );
  }

  const points = SVG_SHAPES[element.shape];
  if (points) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points={points} fill={element.fill} stroke={element.stroke} strokeWidth={element.strokeWidth} />
      </svg>
    );
  }

  return null;
});
