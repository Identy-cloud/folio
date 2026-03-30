import { memo } from "react";
import type { LineElement } from "@/types/elements";

const DASH_MAP: Record<string, string | undefined> = {
  solid: undefined,
  dashed: "8 4",
  dotted: "2 4",
};

export const LineRenderer = memo(function LineRenderer({ element }: { element: LineElement }) {
  const dashArray = DASH_MAP[element.strokeDash ?? "solid"];
  const markerId = `line-arrow-${element.id}`;
  const markerStartId = `line-arrow-start-${element.id}`;
  const hasArrow = element.arrowStart || element.arrowEnd;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${element.w} ${element.h}`}
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      {hasArrow && (
        <defs>
          {element.arrowEnd && (
            <marker
              id={markerId}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={element.strokeColor}
              />
            </marker>
          )}
          {element.arrowStart && (
            <marker
              id={markerStartId}
              markerWidth="10"
              markerHeight="7"
              refX="1"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="10 0, 0 3.5, 10 7"
                fill={element.strokeColor}
              />
            </marker>
          )}
        </defs>
      )}
      <line
        x1={element.x1}
        y1={element.y1}
        x2={element.x2}
        y2={element.y2}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={element.arrowEnd ? `url(#${markerId})` : undefined}
        markerStart={element.arrowStart ? `url(#${markerStartId})` : undefined}
      />
    </svg>
  );
});
