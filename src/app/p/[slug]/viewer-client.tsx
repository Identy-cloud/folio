"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, ShapeElement } from "@/types/elements";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

interface Slide {
  id: string;
  order: number;
  backgroundColor: string;
  elements: SlideElement[];
}

interface Props {
  title: string;
  slides: Slide[];
}

export function ViewerClient({ title, slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const total = slides.length;

  const goNext = useCallback(
    () => setCurrent((c) => Math.min(c + 1, total - 1)),
    [total]
  );
  const goPrev = useCallback(
    () => setCurrent((c) => Math.max(c - 1, 0)),
    []
  );

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;
    const vh = containerRef.current.clientHeight;
    const sx = vw / SLIDE_W;
    const sy = vh / SLIDE_H;
    setScale(Math.min(sx, sy));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "f" || e.key === "F") {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key === "Escape") {
        document.exitFullscreen?.();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  function onTouchStart(e: React.TouchEvent) {
    touchRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchRef.current = null;
  }

  function handleClick(e: React.MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.7) goNext();
    else if (x < rect.width * 0.3) goPrev();
  }

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen items-center justify-center bg-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          backgroundColor: slide.backgroundColor,
          flexShrink: 0,
        }}
      >
        {slide.elements
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => (
            <ViewerElement key={el.id} element={el} />
          ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <span className="text-xs text-white/40">{title}</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/60">
            {current + 1} / {total}
          </span>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              document.documentElement.requestFullscreen?.();
            }}
            className="text-xs text-white/40 hover:text-white/80"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewerElement({ element }: { element: SlideElement }) {
  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.zIndex,
      }}
    >
      {element.type === "text" && <ViewerText element={element} />}
      {element.type === "shape" && <ViewerShape element={element} />}
      {element.type === "image" && (
        <img
          src={element.src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: element.objectFit,
            filter: element.filter,
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

function ViewerText({ element }: { element: TextElement }) {
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" };
  const sanitized = useMemo(
    () => DOMPurify.sanitize(element.content),
    [element.content]
  );
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
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}

function ViewerShape({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: element.fill,
          border:
            element.strokeWidth > 0
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
        border:
          element.strokeWidth > 0
            ? `${element.strokeWidth}px solid ${element.stroke}`
            : "none",
      }}
    />
  );
}
