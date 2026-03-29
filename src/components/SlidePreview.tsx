"use client";

import { memo, useRef, useEffect, useCallback } from "react";
import type { Slide, SlideElement, TextElement, ShapeElement, ArrowElement, DividerElement } from "@/types/elements";

const W = 1920;
const H = 1080;

interface Props {
  slide: Pick<Slide, "backgroundColor" | "backgroundImage" | "elements">;
  className?: string;
}

export const SlidePreview = memo(function SlidePreview({ slide, className }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    canvas.style.setProperty("--preview-scale", String(parent.clientWidth / W));
    const obs = new ResizeObserver(([entry]) => {
      const s = entry.contentRect.width / W;
      canvas.style.setProperty("--preview-scale", String(s));
    });
    obs.observe(parent);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: "16/9" }}
    >
      <div
        ref={parentRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: slide.backgroundColor || "#ffffff",
          backgroundImage: slide.backgroundImage?.startsWith("https://") ? `url("${slide.backgroundImage}")` : undefined,
          backgroundSize: "cover",
        }}
      >
        {/* Inner 1920x1080 canvas scaled to fill the container */}
        <div
          ref={canvasRef}
          style={{
            width: W,
            height: H,
            transform: "scale(var(--preview-scale))",
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {slide.elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => (
              <PreviewElement key={el.id} element={el} />
            ))}
        </div>
      </div>
    </div>
  );
});

const PreviewElement = memo(function PreviewElement({ element }: { element: SlideElement }) {
  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.opacity,
        zIndex: element.zIndex,
        pointerEvents: "none",
      }}
    >
      {element.type === "text" && <PreviewText element={element} />}
      {element.type === "shape" && <PreviewShape element={element} />}
      {element.type === "arrow" && <PreviewArrow element={element} />}
      {element.type === "divider" && <PreviewDivider element={element} />}
      {element.type === "image" && (
        <img
          src={element.src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: element.objectFit,
            filter: element.filter || undefined,
          }}
        />
      )}
    </div>
  );
});

function PreviewText({ element }: { element: TextElement }) {
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" } as const;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: alignMap[element.verticalAlign],
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        lineHeight: element.lineHeight,
        letterSpacing: `${element.letterSpacing}em`,
        color: element.color,
        textAlign: element.textAlign,
        overflow: "hidden",
        wordBreak: "break-word",
      }}
    >
      <span style={{ width: "100%", textAlign: element.textAlign }}>
        {element.content}
      </span>
    </div>
  );
}

function PreviewShape({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: element.fill,
          border: element.strokeWidth > 0
            ? `${element.strokeWidth}px solid ${element.stroke}`
            : "none",
        }}
      />
    );
  }

  if (element.shape === "triangle") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,0 100,100 0,100"
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
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
        border: element.strokeWidth > 0
          ? `${element.strokeWidth}px solid ${element.stroke}`
          : "none",
      }}
    />
  );
}

function PreviewArrow({ element }: { element: ArrowElement }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[element.direction];
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ transform: `rotate(${rotate}deg)` }}>
      <line x1="0" y1="25" x2="85" y2="25" stroke={element.color} strokeWidth={element.strokeWidth} />
      <polygon points="85,10 100,25 85,40" fill={element.color} />
    </svg>
  );
}

function PreviewDivider({ element }: { element: DividerElement }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: element.strokeWidth, backgroundColor: element.color }} />
    </div>
  );
}
