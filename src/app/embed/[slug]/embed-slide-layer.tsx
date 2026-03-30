"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, TableElement, SlideTransition, GradientDef } from "@/types/elements";
import { ShapeRenderer, ArrowRenderer, DividerRenderer, EmbedRenderer, LineRenderer, TableRenderer, VideoRenderer, IconRenderer } from "@/components/elements";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image-utils";
import { slideBackground } from "@/lib/gradient-utils";
import { textShadowCSS, filterBlurCSS } from "@/lib/element-style-utils";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  backgroundImage: string | null;
  elements: SlideElement[];
}

interface Props {
  slide: Slide;
  scale: number;
  onSlideJump?: (index: number) => void;
}

export function EmbedSlideLayer({ slide, scale, onSlideJump }: Props) {
  const sorted = useMemo(
    () => slide.elements.filter((el) => el.visible !== false).slice().sort((a, b) => a.zIndex - b.zIndex),
    [slide.elements]
  );

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        position: "absolute",
        ...slideBackground(slide.backgroundColor, slide.backgroundGradient, slide.backgroundImage),
      }}
    >
      {sorted.map((el) => (
        <EmbedElement key={el.id} element={el} onSlideJump={onSlideJump} />
      ))}
    </div>
  );
}

function EmbedElement({ element, onSlideJump }: { element: SlideElement; onSlideJump?: (index: number) => void }) {
  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        zIndex: element.zIndex,
        boxShadow: element.shadow
          ? `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`
          : undefined,
        border: (element.borderWidth ?? 0) > 0 ? `${element.borderWidth}px solid ${element.borderColor ?? "#000"}` : undefined,
        filter: filterBlurCSS(element.filterBlur),
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
          opacity: element.opacity,
        }}
      >
        {element.type === "text" && <EmbedText element={element} />}
        {element.type === "shape" && <ShapeRenderer element={element} />}
        {element.type === "arrow" && <ArrowRenderer element={element} />}
        {element.type === "divider" && <DividerRenderer element={element} />}
        {element.type === "embed" && <EmbedRenderer element={element} />}
        {element.type === "line" && <LineRenderer element={element} />}
        {element.type === "table" && <TableRenderer element={element as TableElement} />}
        {element.type === "video" && <VideoRenderer element={element} mode="viewer" />}
        {element.type === "icon" && <IconRenderer element={element} />}
        {element.type === "image" && <EmbedImage element={element} />}
      </div>
      {element.linkSlideIndex !== undefined && onSlideJump ? (
        <button
          className="absolute inset-0 z-10 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={(e) => { e.stopPropagation(); onSlideJump(element.linkSlideIndex!); }}
          aria-label={`Go to slide ${element.linkSlideIndex + 1}`}
        />
      ) : null}
    </div>
  );
}

function EmbedText({ element }: { element: TextElement }) {
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" } as const;
  const sanitized = useMemo(() => DOMPurify.sanitize(element.content), [element.content]);
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
        textShadow: textShadowCSS(element.textShadow),
        lineHeight: element.lineHeight,
        letterSpacing: `${element.letterSpacing}em`,
        color: element.color,
        textAlign: element.textAlign,
        overflow: "hidden",
        wordBreak: "break-word",
      }}
    >
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}

function EmbedImage({ element }: { element: SlideElement }) {
  if (element.type !== "image") return null;
  return (
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
        src={getOptimizedImageUrl(element.src, IMAGE_PRESETS.full)}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: element.objectFit,
          filter: element.filter || undefined,
          transform: `${element.flipX ? "scaleX(-1)" : ""} ${element.flipY ? "scaleY(-1)" : ""}`.trim() || undefined,
        }}
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}
