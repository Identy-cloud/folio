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
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;

  // Detect mobile
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scale
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;
    const vh = containerRef.current.clientHeight;
    setScale(Math.min(vw / SLIDE_W, vh / SLIDE_H));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  // Navigation
  const goNext = useCallback(() => {
    if (animating || current >= total - 1) return;
    setDirection("next");
    setAnimating(true);
    setCurrent((c) => c + 1);
  }, [animating, current, total]);

  const goPrev = useCallback(() => {
    if (animating || current <= 0) return;
    setDirection("prev");
    setAnimating(true);
    setCurrent((c) => c - 1);
  }, [animating, current]);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "f" || e.key === "F") document.documentElement.requestFullscreen?.();
      if (e.key === "Escape") document.exitFullscreen?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    // Only handle horizontal swipes (ignore vertical scrolls)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  // Click zones (desktop)
  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65) goNext();
    else if (x < rect.width * 0.35) goPrev();
  }

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Slide with transition */}
      <div
        key={slide.id}
        className={animating ? (direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left") : ""}
        onAnimationEnd={() => setAnimating(false)}
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "absolute",
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

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <span className="max-w-[40%] truncate text-[10px] text-white/40 sm:text-xs">
          {title}
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[10px] text-white/60 sm:text-xs">
            {current + 1} / {total}
          </span>
          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20 sm:w-32">
            <div
              className="h-full bg-white/60 transition-all duration-500 ease-out"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          {!isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.documentElement.requestFullscreen?.();
              }}
              className="text-white/40 hover:text-white/80 transition-colors"
              title="Pantalla completa (F)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h4V0H0v6h2V2zm12 0h-4V0h6v6h-2V2zM2 14h4v2H0v-6h2v4zm12 0h-4v2h6v-6h-2v4z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Touch hint on mobile - shown briefly */}
      {isMobile && current === 0 && !animating && (
        <div className="absolute inset-x-0 bottom-16 flex justify-center pointer-events-none animate-fade-out">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] text-white/50">
            Desliza para navegar ←→
          </span>
        </div>
      )}
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
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
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
            filter: element.filter || undefined,
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

function ViewerText({ element }: { element: TextElement }) {
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
}
