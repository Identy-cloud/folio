"use client";

import { memo } from "react";
import type { Slide, SlideElement, TextElement, ShapeElement } from "@/types/elements";

const W = 1920;
const H = 1080;

interface Props {
  slide: Pick<Slide, "backgroundColor" | "backgroundImage" | "elements">;
  className?: string;
}

export const SlidePreview = memo(function SlidePreview({ slide, className }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: "16/9" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: slide.backgroundColor || "#ffffff",
          backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
          backgroundSize: "cover",
        }}
      >
        {/* Inner 1920x1080 canvas scaled to fill the container */}
        <div
          style={{
            width: W,
            height: H,
            transform: "scale(var(--preview-scale))",
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          ref={(el) => {
            if (!el) return;
            const parent = el.parentElement;
            if (!parent) return;
            const obs = new ResizeObserver(([entry]) => {
              const s = entry.contentRect.width / W;
              el.style.setProperty("--preview-scale", String(s));
            });
            obs.observe(parent);
            // Initial scale
            el.style.setProperty("--preview-scale", String(parent.clientWidth / W));
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
