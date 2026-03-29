"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, SlideTransition } from "@/types/elements";
import { getElementAnimationStyle } from "@/lib/element-animation";
import { ShapeRenderer, ArrowRenderer, DividerRenderer } from "@/components/elements";
import { MobileViewer } from "./mobile-viewer";

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const TRANSITION_MS = 400;

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
}

export function ViewerClient({ title, slides, showWatermark }: Props) {
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "active">("idle");
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
    setPhase("enter");

    // Frame 1: render with "enter" styles (starting position)
    const raf = requestAnimationFrame(() => {
      // Frame 2: switch to "active" styles (triggers CSS transition)
      setPhase("active");
    });

    const timer = setTimeout(() => {
      setDisplayed(current);
      setTransitioning(false);
      setPhase("idle");
    }, TRANSITION_MS);

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
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

  const [hoverZone, setHoverZone] = useState<"left" | "right" | null>(null);

  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65) goNext();
    else if (x < rect.width * 0.35) goPrev();
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65 && current < total - 1) setHoverZone("right");
    else if (x < rect.width * 0.35 && current > 0) setHoverZone("left");
    else setHoverZone(null);
  }

  if (isMobile) {
    return <MobileViewer title={title} slides={slides} showWatermark={showWatermark} />;
  }

  const outgoing = slides[displayed];
  const incoming = slides[current];
  const transType = incoming?.transition ?? "fade";
  const dir = current > displayed ? 1 : -1;

  function getTransitionStyles(role: "in" | "out"): React.CSSProperties {
    const dur = `${TRANSITION_MS}ms`;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    const isEntering = phase === "enter";

    if (transType === "fade") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `opacity ${dur} ${ease}`,
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `opacity ${dur} ${ease}`,
        opacity: 0,
      };
    }
    if (transType === "slide-left") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: `scale(${scale}) translateX(${isEntering ? `${dir * 30}%` : "0%"})`,
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale}) translateX(${-dir * 30}%)`,
        opacity: 0,
      };
    }
    if (transType === "slide-up") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: `scale(${scale}) translateY(${isEntering ? "30%" : "0%"})`,
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale}) translateY(-30%)`,
        opacity: 0,
      };
    }
    if (transType === "zoom") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: `scale(${isEntering ? scale * 0.85 : scale})`,
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale * 1.15})`,
        opacity: 0,
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
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverZone(null)}
      style={{ cursor: hoverZone ? "pointer" : "default" }}
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
        transitionStyle={transitioning ? getTransitionStyles("in") : undefined}
        animateKey={transitioning ? -1 : current}
      />

      {/* Free tier watermark */}
      {showWatermark && (
        <div className="pointer-events-none absolute top-4 right-4 z-10">
          <span className="rounded bg-black/40 px-2.5 py-1 text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase backdrop-blur-sm">
            Made with Folio
          </span>
        </div>
      )}

      {/* Navigation hover arrows */}
      {hoverZone === "left" && (
        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/30 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
        </div>
      )}
      {hoverZone === "right" && (
        <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white/30 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent pt-8">
        <div className="flex items-center justify-between px-4 pb-2 sm:px-6">
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.documentElement.requestFullscreen?.();
              }}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Fullscreen"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h4V0H0v6h2V2zm12 0h-4V0h6v6h-2V2zM2 14h4v2H0v-6h2v4zm12 0h-4v2h6v-6h-2v4z" />
              </svg>
            </button>
          </div>
        </div>
        <a
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="block border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/30 hover:text-white/50 transition-colors sm:text-xs"
        >
          Folio — Editorial Slides
        </a>
      </div>

    </div>
  );
}

function SlideLayer({
  slide,
  scale,
  transitionStyle,
  animateKey,
}: {
  slide: Slide;
  scale: number;
  transitionStyle?: React.CSSProperties;
  animateKey?: number;
}) {
  const sorted = useMemo(
    () => slide.elements.slice().sort((a, b) => a.zIndex - b.zIndex),
    [slide.elements]
  );

  const shouldAnimate = animateKey !== undefined && animateKey >= 0;

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        position: "absolute",
        backgroundColor: slide.backgroundColor,
        backgroundImage: slide.backgroundImage?.startsWith("https://") ? `url("${slide.backgroundImage}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...transitionStyle,
      }}
    >
      {sorted.map((el, i) => (
        <ViewerElement
          key={shouldAnimate ? `${el.id}-${animateKey}` : el.id}
          element={el}
          delay={shouldAnimate ? i * 80 : 0}
          animate={shouldAnimate}
        />
      ))}
    </div>
  );
}

function ViewerElement({ element, delay, animate }: { element: SlideElement; delay: number; animate: boolean }) {
  const totalDelay = (element.animationDelay ?? 0) + delay;
  const animStyle = animate ? getElementAnimationStyle(element.animation, totalDelay) : {};

  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        zIndex: element.zIndex,
        ...animStyle,
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
      {element.type === "text" && <ViewerText element={element} />}
      {element.type === "shape" && <ShapeRenderer element={element} />}
      {element.type === "arrow" && <ArrowRenderer element={element} />}
      {element.type === "divider" && <DividerRenderer element={element} />}
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
          loading="lazy"
        />
      )}
      </div>
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

