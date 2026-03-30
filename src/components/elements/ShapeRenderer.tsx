import { memo } from "react";
import type { ShapeElement } from "@/types/elements";
import { gradientToCSS } from "@/lib/gradient-utils";

function fillStyle(element: ShapeElement): React.CSSProperties {
  if (element.fillGradient && element.fillGradient.stops.length >= 2) {
    return { background: gradientToCSS(element.fillGradient) };
  }
  if (element.fill.startsWith("linear-gradient") || element.fill.startsWith("radial-gradient")) {
    return { background: element.fill };
  }
  return { backgroundColor: element.fill };
}

function svgFill(element: ShapeElement): string {
  if (element.fillGradient && element.fillGradient.stops.length >= 2) {
    return element.fillGradient.stops[0].color;
  }
  return element.fill;
}

function svgGradientDefs(element: ShapeElement, id: string): React.ReactNode {
  const g = element.fillGradient;
  if (!g || g.stops.length < 2) return null;
  if (g.type === "radial") {
    return (
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          {g.stops.map((s, i) => (
            <stop key={i} offset={`${s.position}%`} stopColor={s.color} />
          ))}
        </radialGradient>
      </defs>
    );
  }
  const angle = (g.angle ?? 135) * (Math.PI / 180);
  const x1 = 50 - Math.cos(angle) * 50;
  const y1 = 50 - Math.sin(angle) * 50;
  const x2 = 50 + Math.cos(angle) * 50;
  const y2 = 50 + Math.sin(angle) * 50;
  return (
    <defs>
      <linearGradient id={id} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
        {g.stops.map((s, i) => (
          <stop key={i} offset={`${s.position}%`} stopColor={s.color} />
        ))}
      </linearGradient>
    </defs>
  );
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
          ...fillStyle(element),
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
          ...fillStyle(element),
          borderRadius: element.borderRadius,
          border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
        }}
      />
    );
  }

  const points = SVG_SHAPES[element.shape];
  if (points) {
    const hasGradient = element.fillGradient && element.fillGradient.stops.length >= 2;
    const gradId = `grad-${element.id}`;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {hasGradient && svgGradientDefs(element, gradId)}
        <polygon
          points={points}
          fill={hasGradient ? `url(#${gradId})` : svgFill(element)}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      </svg>
    );
  }

  return null;
});
