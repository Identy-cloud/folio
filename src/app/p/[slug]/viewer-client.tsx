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

type ViewMode = "desktop" | "tablet" | "mobile";

function useViewMode(): ViewMode {
  const [mode, setMode] = useState<ViewMode>("desktop");
  useEffect(() => {
    function check() {
      const w = window.innerWidth;
      setMode(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mode;
}

export function ViewerClient({ title, slides }: Props) {
  const mode = useViewMode();

  if (mode === "mobile") {
    return <MobileViewer title={title} slides={slides} />;
  }

  return <DesktopViewer title={title} slides={slides} mode={mode} />;
}

function DesktopViewer({
  title,
  slides,
  mode,
}: Props & { mode: "desktop" | "tablet" }) {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number } | null>(null);
  const total = slides.length;

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

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

  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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
      onTouchStart={(e) => { touchRef.current = { x: e.touches[0].clientX }; }}
      onTouchEnd={(e) => {
        if (!touchRef.current) return;
        const dx = e.changedTouches[0].clientX - touchRef.current.x;
        if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
        touchRef.current = null;
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: SLIDE_W, height: SLIDE_H,
          transform: `scale(${scale})`, transformOrigin: "center center",
          position: "relative", backgroundColor: slide.backgroundColor, flexShrink: 0,
        }}
      >
        {slide.elements.slice().sort((a, b) => a.zIndex - b.zIndex).map((el) => (
          <DesktopElement key={el.id} element={el} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <span className="text-xs text-white/40">{title}</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/60">{current + 1} / {total}</span>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          {mode === "desktop" && (
            <button
              onClick={(e) => { e.stopPropagation(); document.documentElement.requestFullscreen?.(); }}
              className="text-xs text-white/40 hover:text-white/80"
            >
              ⛶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileViewer({ title, slides }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrent(idx);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-black">
      <div
        ref={scrollRef}
        className="flex flex-1 overflow-x-auto"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-screen overflow-y-auto"
            style={{ scrollSnapAlign: "start", backgroundColor: slide.backgroundColor }}
          >
            <MobileSlide elements={slide.elements} bg={slide.backgroundColor} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <span className="text-[10px] text-white/40 truncate max-w-[40%]">{title}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/60">{current + 1} / {total}</span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSlide({
  elements,
  bg,
}: {
  elements: SlideElement[];
  bg: string;
}) {
  const sorted = useMemo(() => {
    const titles: SlideElement[] = [];
    const images: SlideElement[] = [];
    const body: SlideElement[] = [];

    for (const el of elements) {
      if (el.type === "text" && el.fontSize >= 48) titles.push(el);
      else if (el.type === "image") images.push(el);
      else if (el.type === "text") body.push(el);
    }

    titles.sort((a, b) => {
      const fa = a.type === "text" ? a.fontSize : 0;
      const fb = b.type === "text" ? b.fontSize : 0;
      return fb - fa;
    });

    return [...titles, ...images, ...body];
  }, [elements]);

  return (
    <div className="min-h-full px-6 py-8 space-y-4" style={{ backgroundColor: bg }}>
      {sorted.map((el) => (
        <MobileElement key={el.id} element={el} />
      ))}
    </div>
  );
}

function MobileElement({ element }: { element: SlideElement }) {
  if (element.type === "shape" || element.type === "arrow") return null;

  if (element.type === "image") {
    return (
      <img
        src={element.src}
        alt=""
        className="w-full rounded"
        style={{
          aspectRatio: `${element.w} / ${element.h}`,
          objectFit: "cover",
          filter: element.filter || undefined,
        }}
      />
    );
  }

  if (element.type === "text") {
    const isTitle = element.fontSize >= 48;
    const mobileFontSize = isTitle
      ? Math.min(element.fontSize * 0.4, 48)
      : Math.max(element.fontSize * 0.7, 16);

    const sanitized = DOMPurify.sanitize(element.content);

    return (
      <div
        style={{
          fontFamily: element.fontFamily,
          fontSize: mobileFontSize,
          fontWeight: element.fontWeight,
          lineHeight: isTitle ? 1.1 : 1.6,
          letterSpacing: `${element.letterSpacing}em`,
          color: element.color,
          opacity: element.opacity,
        }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return null;
}

function DesktopElement({ element }: { element: SlideElement }) {
  return (
    <div
      style={{
        position: "absolute",
        left: element.x, top: element.y,
        width: element.w, height: element.h,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.zIndex,
      }}
    >
      {element.type === "text" && <DesktopText element={element} />}
      {element.type === "shape" && <DesktopShape element={element} />}
      {element.type === "image" && (
        <img
          src={element.src}
          alt=""
          style={{
            width: "100%", height: "100%",
            objectFit: element.objectFit,
            filter: element.filter || undefined,
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

function DesktopText({ element }: { element: TextElement }) {
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" };
  const sanitized = useMemo(() => DOMPurify.sanitize(element.content), [element.content]);
  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex",
        alignItems: alignMap[element.verticalAlign],
        fontFamily: element.fontFamily, fontSize: element.fontSize,
        fontWeight: element.fontWeight, lineHeight: element.lineHeight,
        letterSpacing: `${element.letterSpacing}em`, color: element.color,
        textAlign: element.textAlign, overflow: "hidden", wordBreak: "break-word",
      }}
    >
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}

function DesktopShape({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%", height: "100%", borderRadius: "50%",
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
        width: "100%", height: "100%",
        backgroundColor: element.fill, borderRadius: element.borderRadius,
        border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : "none",
      }}
    />
  );
}
