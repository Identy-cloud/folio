"use client";

import { memo, useRef, useEffect, useCallback } from "react";
import type { Slide, SlideElement, TextElement, TableElement } from "@/types/elements";
import { ShapeRenderer, ArrowRenderer, DividerRenderer, LineRenderer, TableRenderer, VideoRenderer, IconRenderer } from "@/components/elements";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image-utils";
import { slideBackground } from "@/lib/gradient-utils";

const W = 1920;
const H = 1080;

interface Props {
  slide: Pick<Slide, "backgroundColor" | "backgroundGradient" | "backgroundImage" | "elements">;
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
          ...slideBackground(slide.backgroundColor || "#ffffff", slide.backgroundGradient, slide.backgroundImage),
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
        boxShadow: element.shadow
          ? `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`
          : undefined,
        border: (element.borderWidth ?? 0) > 0 ? `${element.borderWidth}px solid ${element.borderColor ?? "#000"}` : undefined,
        pointerEvents: "none",
      }}
    >
      {element.type === "text" && <PreviewText element={element} />}
      {element.type === "shape" && <ShapeRenderer element={element} />}
      {element.type === "arrow" && <ArrowRenderer element={element} />}
      {element.type === "divider" && <DividerRenderer element={element} />}
      {element.type === "line" && <LineRenderer element={element} />}
      {element.type === "table" && <TableRenderer element={element as TableElement} />}
      {element.type === "video" && <VideoRenderer element={element} mode="preview" />}
      {element.type === "icon" && <IconRenderer element={element} />}
      {element.type === "image" && (
        <div style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: element.borderRadius ?? 0,
          clipPath: (element.cropWidth ?? 1) < 1 || (element.cropHeight ?? 1) < 1 || (element.cropX ?? 0) > 0 || (element.cropY ?? 0) > 0
            ? `inset(${(element.cropY ?? 0) * 100}% ${(1 - (element.cropX ?? 0) - (element.cropWidth ?? 1)) * 100}% ${(1 - (element.cropY ?? 0) - (element.cropHeight ?? 1)) * 100}% ${(element.cropX ?? 0) * 100}%)`
            : undefined,
        }}>
          <img
            src={getOptimizedImageUrl(element.src, IMAGE_PRESETS.thumbnail)}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: element.objectFit,
              filter: element.filter || undefined,
              transform: `${element.flipX ? "scaleX(-1)" : ""} ${element.flipY ? "scaleY(-1)" : ""}`.trim() || undefined,
            }}
          />
        </div>
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
        fontStyle: element.fontStyle ?? "normal",
        textDecoration: element.textDecoration ?? "none",
        WebkitTextStroke: element.textStroke ? `${element.textStroke.width}px ${element.textStroke.color}` : undefined,
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

