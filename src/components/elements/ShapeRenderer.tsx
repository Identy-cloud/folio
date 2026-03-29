import { memo } from "react";
import type { ShapeElement } from "@/types/elements";

export const ShapeRenderer = memo(function ShapeRenderer({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: element.fill,
          border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
        }}
      />
    );
  }
  if (element.shape === "triangle") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,0 100,100 0,100" fill={element.fill} stroke={element.stroke} strokeWidth={element.strokeWidth} />
      </svg>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: element.fill,
        borderRadius: element.borderRadius,
        border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
      }}
    />
  );
});
