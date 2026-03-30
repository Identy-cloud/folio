"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, TableElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";
import { getElementAnimationStyle } from "@/lib/element-animation";
import { ShapeRenderer, ArrowRenderer, DividerRenderer, EmbedRenderer, LineRenderer, TableRenderer, VideoRenderer, IconRenderer } from "@/components/elements";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image-utils";
import { slideBackground } from "@/lib/gradient-utils";
import { useViewerFonts } from "@/hooks/useViewerFonts";
import { MobileViewer } from "./mobile-viewer";
import { CommentsPanel } from "./comments-panel";
import { ReportModal } from "@/components/ReportModal";

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const DEFAULT_TRANSITION_MS = 400;

interface Slide {
  id: string;
  order: number;
  transition: SlideTransition;
  transitionDuration?: number;
  transitionEasing?: TransitionEasing;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId?: string;
  hasPassword?: boolean;
}

export function ViewerClient({ title, slides, showWatermark, presentationId, hasPassword }: Props) {
  useViewerFonts(presentationId);
  const [unlocked, setUnlocked] = useState(!hasPassword);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!showHelp) return;
    const t = setTimeout(() => setShowHelp(false), 4000);
    return () => clearTimeout(t);
  }, [showHelp]);

  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetHideTimer() {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [current]);
  const [transitioning, setTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "active">("idle");

  // Track analytics
  useEffect(() => {
    if (presentationId) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId, slideIndex: current }),
      }).catch(() => {});
    }
  }, [presentationId, current]);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerBoundsRef = useRef<DOMRect | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updateBoundsAndScale = useCallback(() => {
    if (!containerRef.current) return;
    containerBoundsRef.current = containerRef.current.getBoundingClientRect();
    const vw = containerRef.current.clientWidth;
    const vh = containerRef.current.clientHeight;
    setScale(Math.min(vw / SLIDE_W, vh / SLIDE_H));
  }, []);

  useEffect(() => {
    updateBoundsAndScale();
    window.addEventListener("resize", updateBoundsAndScale);
    return () => window.removeEventListener("resize", updateBoundsAndScale);
  }, [updateBoundsAndScale]);

  // When current changes, start transition
  useEffect(() => {
    if (current === displayed) return;
    const incomingSlide = slides[current];
    const t = incomingSlide?.transition ?? "fade";
    if (t === "none") {
      setDisplayed(current);
      return;
    }
    const ms = incomingSlide?.transitionDuration ?? DEFAULT_TRANSITION_MS;
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
    }, ms);

    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [current, displayed, slides]);

  const goNext = useCallback(() => {
    if (transitioning || current >= total - 1) return;
    setCurrent((c) => c + 1);
  }, [transitioning, total, current]);

  const goPrev = useCallback(() => {
    if (transitioning || current <= 0) return;
    setCurrent((c) => c - 1);
  }, [transitioning, current]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goPrev(); }
      if (e.key === "Home") { e.preventDefault(); setCurrent(0); }
      if (e.key === "End") { e.preventDefault(); setCurrent(total - 1); }
      if (e.key === "f" || e.key === "F") document.documentElement.requestFullscreen?.();
      if (e.key === "Escape") document.exitFullscreen?.();
      // Type digits to jump to slide number
      if (e.key === "?") { setShowHelp((v) => !v); return; }
      if (e.key >= "1" && e.key <= "9") {
        const n = parseInt(e.key) - 1;
        if (n < total) setCurrent(n);
      }
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
    // Swipe up = fullscreen
    if (dy < -80 && Math.abs(dy) > Math.abs(dx)) {
      document.documentElement.requestFullscreen?.();
    }
  }

  useEffect(() => {
    if (!autoplay) { if (autoplayRef.current) clearTimeout(autoplayRef.current); return; }
    function scheduleNext() {
      const currentSlide = slides[current];
      const ms = ((currentSlide as { duration?: number })?.duration ?? 5) * 1000;
      autoplayRef.current = setTimeout(() => {
        setCurrent((c) => {
          if (c >= total - 1) {
            if (loop) return 0;
            setAutoplay(false);
            return c;
          }
          return c + 1;
        });
        scheduleNext();
      }, ms);
    }
    scheduleNext();
    return () => { if (autoplayRef.current) clearTimeout(autoplayRef.current); };
  }, [autoplay, total, current, slides]);

  const [hoverZone, setHoverZone] = useState<"left" | "right" | null>(null);

  function handleClick(e: React.MouseEvent) {
    const rect = containerBoundsRef.current;
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65) goNext();
    else if (x < rect.width * 0.35) goPrev();
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerBoundsRef.current;
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.65 && current < total - 1) setHoverZone("right");
    else if (x < rect.width * 0.35 && current > 0) setHoverZone("left");
    else setHoverZone(null);
  }

  if (!unlocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-black px-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!presentationId) return;
            const res = await fetch(`/api/presentations/${presentationId}/verify-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password: pwInput }),
            });
            const data = await res.json();
            if (data.valid) setUnlocked(true);
            else setPwError(true);
          }}
          className="w-full max-w-xs space-y-4 text-center"
        >
          <h1 className="font-display text-3xl tracking-tight text-white">FOLIO</h1>
          <p className="text-xs text-neutral-500">This presentation is password protected</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
            placeholder="Enter password"
            autoFocus
            className="w-full border-b border-neutral-700 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
          />
          {pwError && <p className="text-xs text-red-400">Incorrect password</p>}
          <button type="submit" className="w-full bg-white py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors">
            Enter
          </button>
        </form>
      </div>
    );
  }

  if (isMobile) {
    return <MobileViewer title={title} slides={slides} showWatermark={showWatermark} presentationId={presentationId} />;
  }

  const outgoing = slides[displayed];
  const incoming = slides[current];
  const transType = incoming?.transition ?? "fade";
  const transMs = incoming?.transitionDuration ?? DEFAULT_TRANSITION_MS;
  const transEase = incoming?.transitionEasing ?? "ease";
  const dir = current > displayed ? 1 : -1;

  function getTransitionStyles(role: "in" | "out"): React.CSSProperties {
    const dur = `${transMs}ms`;
    const ease = transEase;
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
    if (transType === "slide-right") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: `scale(${scale}) translateX(${isEntering ? `${-dir * 30}%` : "0%"})`,
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `scale(${scale}) translateX(${dir * 30}%)`,
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
    if (transType === "blur") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `opacity ${dur} ${ease}, filter ${dur} ${ease}`,
          opacity: isEntering ? 0 : 1,
          filter: isEntering ? "blur(20px)" : "blur(0px)",
        };
      }
      return {
        transition: `opacity ${dur} ${ease}, filter ${dur} ${ease}`,
        opacity: 0,
        filter: "blur(20px)",
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
      onMouseMove={(e) => { handleMouseMove(e); resetHideTimer(); }}
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
      {/* Autoplay countdown bar */}
      {autoplay && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <div
            className="h-full bg-blue-500/60"
            style={{
              animation: `countdown-bar ${((slides[current] as { duration?: number })?.duration ?? 5)}s linear`,
              animationFillMode: "forwards",
            }}
            key={`${current}-${Date.now()}`}
          />
        </div>
      )}

      {showHelp && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="rounded-lg bg-black/70 px-6 py-4 backdrop-blur-sm text-center animate-[fade-in_0.3s_ease-out]">
            <div className="flex justify-center gap-4 text-white/80">
              <div className="text-center">
                <kbd className="rounded bg-white/20 px-2 py-1 text-xs font-mono">← →</kbd>
                <p className="mt-1 text-[10px] text-white/50">Navigate</p>
              </div>
              <div className="text-center">
                <kbd className="rounded bg-white/20 px-2 py-1 text-xs font-mono">F</kbd>
                <p className="mt-1 text-[10px] text-white/50">Fullscreen</p>
              </div>
              <div className="text-center">
                <kbd className="rounded bg-white/20 px-2 py-1 text-xs font-mono">Space</kbd>
                <p className="mt-1 text-[10px] text-white/50">Next</p>
              </div>
              <div className="text-center">
                <kbd className="rounded bg-white/20 px-2 py-1 text-xs font-mono">1-9</kbd>
                <p className="mt-1 text-[10px] text-white/50">Jump</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <div className={`fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent pt-8 transition-opacity duration-500 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex items-center justify-between px-4 pb-2 sm:px-6">
          <span className="max-w-[40%] truncate text-[10px] text-white/40 sm:text-xs">
            {title}
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-[10px] text-white/60 sm:text-xs tabular-nums transition-all duration-200">
              <span key={current} className="inline-block animate-[fade-in_0.2s_ease-out]">{current + 1}</span> / {total}
              <span className="ml-1 text-white/30">({Math.round(((current + 1) / total) * 100)}%)</span>
            </span>
            {total <= 20 ? (
              <div className="flex gap-1">
                {Array.from({ length: total }, (_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-4 bg-white/80" : i < current ? "w-1.5 bg-white/40" : "w-1.5 bg-white/20"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20 sm:w-32">
                <div
                  className="h-full bg-white/60 transition-all duration-500 ease-out"
                  style={{ width: `${((current + 1) / total) * 100}%` }}
                />
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setAutoplay((v) => !v); }}
              className={`text-xs transition-colors ${autoplay ? "text-blue-400" : "text-white/40 hover:text-white/80"}`}
              aria-label="Autoplay"
            >
              {autoplay ? "⏸" : "▶"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLoop((v) => !v); }}
              className={`text-[10px] transition-colors ${loop ? "text-blue-400" : "text-white/30 hover:text-white/60"}`}
              aria-label="Loop"
              title={loop ? "Loop on" : "Loop off"}
            >
              ↻
            </button>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(window.location.href);
                const btn = e.currentTarget;
                btn.textContent = "Copied!";
                setTimeout(() => { btn.textContent = "Share"; }, 1500);
              }}
              className="text-white/40 hover:text-white/80 transition-colors text-[10px] sm:text-xs"
            >
              Share
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2">
          <a
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-white/30 hover:text-white/50 transition-colors sm:text-xs"
          >
            Folio — Editorial Slides
          </a>
          {presentationId && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const res = await fetch(`/api/presentations/${presentationId}/clone`, { method: "POST" });
                if (res.ok) {
                  const p = await res.json();
                  window.open(`/editor/${p.id}`, "_blank");
                } else if (res.status === 401) {
                  window.open("/login", "_blank");
                }
              }}
              className="text-[10px] text-white/40 hover:text-white/70 transition-colors sm:text-xs"
            >
              Use as template →
            </button>
          )}
        </div>
      </div>

      {presentationId && (
        <CommentsPanel
          presentationId={presentationId}
          currentSlide={current}
          totalSlides={slides.length}
        />
      )}

      {presentationId && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
          className="fixed bottom-20 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/40 backdrop-blur-sm hover:bg-white/20 hover:text-white/70 transition-colors"
          aria-label="Report content"
          title="Report content"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>
      )}

      {showReport && presentationId && (
        <ReportModal
          presentationId={presentationId}
          onClose={() => setShowReport(false)}
        />
      )}
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
        ...slideBackground(slide.backgroundColor, slide.backgroundGradient, slide.backgroundImage),
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
  const animStyle = animate ? getElementAnimationStyle(element.animation, totalDelay, element.animationDuration, element.animationEasing) : {};

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
      {element.type === "embed" && <EmbedRenderer element={element} />}
      {element.type === "line" && <LineRenderer element={element} />}
      {element.type === "table" && <TableRenderer element={element as TableElement} />}
      {element.type === "video" && <VideoRenderer element={element} mode="viewer" />}
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
      )}
      </div>
      {element.linkUrl && (
        <a
          href={element.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Link to ${element.linkUrl}`}
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
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}

