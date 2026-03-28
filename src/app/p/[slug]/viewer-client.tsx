"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, ShapeElement, SlideTransition } from "@/types/elements";

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const TRANSITION_MS = 400;

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
}

export function ViewerClient({ title, slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // When current changes, start transition
  useEffect(() => {
    if (current === displayed) return;
    const t = slides[current]?.transition ?? "fade";
    if (t === "none") {
      setDisplayed(current);
      return;
    }
    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayed(current);
      setTransitioning(false);
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [current, displayed, slides]);

  const goNext = useCallback(() => {
    if (transitioning || current >= total - 1) return;
    setCurrent((c) => c + 1);
  }, [transitioning, current, total]);

  const goPrev = useCallback(() => {
    if (transitioning || current <= 0) return;
    setCurrent((c) => c - 1);
  }, [transitioning, current]);

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

  function handleTouchStart(e: React.TouchEvent) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65) goNext();
    else if (x < rect.width * 0.35) goPrev();
  }

  const outgoing = slides[displayed];
  const incoming = slides[current];
  const transType = incoming?.transition ?? "fade";
  const dir = current > displayed ? 1 : -1;

  function getTransitionStyles(role: "in" | "out"): React.CSSProperties {
    const dur = `${TRANSITION_MS}ms`;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    if (transType === "fade") {
      return {
        transition: `opacity ${dur} ${ease}`,
        opacity: role === "in" ? 1 : 0,
      };
    }
    if (transType === "slide-left") {
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale}) translateX(${role === "in" ? "0%" : `${-dir * 30}%`})`,
        opacity: role === "in" ? 1 : 0,
      };
    }
    if (transType === "slide-up") {
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale}) translateY(${role === "in" ? "0%" : `${30}%`})`,
        opacity: role === "in" ? 1 : 0,
      };
    }
    if (transType === "zoom") {
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${role === "in" ? scale : scale * 0.85})`,
        opacity: role === "in" ? 1 : 0,
      };
    }
    return { opacity: 1 };
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Outgoing slide */}
      {transitioning && outgoing && (
        <SlideLayer
          slide={outgoing}
          scale={scale}
          transitionStyle={getTransitionStyles("out")}
        />
      )}

      {/* Current slide */}
      <SlideLayer
        slide={incoming ?? outgoing}
        scale={scale}
        transitionStyle={transitioning ? getTransitionStyles("in") : undefined
        }
      />

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
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

      {/* Swipe hint */}
      {isMobile && current === 0 && !transitioning && (
        <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center pointer-events-none animate-fade-out">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] text-white/50">
            Desliza para navegar ←→
          </span>
        </div>
      )}
    </div>
  );
}

function SlideLayer({
  slide,
  scale,
  transitionStyle,
}: {
  slide: Slide;
  scale: number;
  transitionStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        position: "absolute",
        backgroundColor: slide.backgroundColor,
        ...transitionStyle,
      }}
    >
      {slide.elements
        .slice()
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((el) => (
          <ViewerElement key={el.id} element={el} />
        ))}
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
