"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, ShapeElement, TableElement, VideoElement, IconElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";
import { getElementAnimationStyle } from "@/lib/element-animation";
import { VideoRenderer } from "@/components/elements/VideoRenderer";
import { IconRenderer } from "@/components/elements/IconRenderer";
import { useTranslation } from "@/lib/i18n/context";
import { ReportModal } from "@/components/ReportModal";
import { gradientToCSS } from "@/lib/gradient-utils";
import { textShadowCSS } from "@/lib/element-style-utils";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import { RecordingPlayer } from "./recording-player";

interface Slide {
  id: string;
  transition: SlideTransition;
  transitionDuration?: number;
  transitionEasing?: TransitionEasing;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface TimelineEntry {
  slideIndex: number;
  startTime: number;
}

interface Props {
  title: string;
  slides: Slide[];
  showWatermark?: boolean;
  presentationId?: string;
  forkCount?: number;
  recordingUrl?: string;
  recordingTimeline?: TimelineEntry[];
  recordingDuration?: number;
}

const DEFAULT_TRANSITION_MS = 350;

function mobileBg(slide: Slide): string {
  if (slide.backgroundGradient && slide.backgroundGradient.stops.length >= 2) {
    return gradientToCSS(slide.backgroundGradient);
  }
  return slide.backgroundColor;
}

export function MobileViewer({ title, slides, showWatermark, presentationId, forkCount, recordingUrl, recordingTimeline, recordingDuration }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [forking, setForking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [localForkCount, setLocalForkCount] = useState(forkCount ?? 0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleFork = useCallback(async () => {
    if (!presentationId || forking) return;
    setForking(true);
    try {
      const res = await fetch(`/api/presentations/${presentationId}/clone`, { method: "POST" });
      if (res.ok) {
        const p = await res.json();
        setLocalForkCount((c) => c + 1);
        setToast({ message: "Forked! Redirecting...", type: "success" });
        setTimeout(() => { window.location.href = `/editor/${p.id}`; }, 800);
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (res.status === 403) {
        const data = await res.json();
        if (data.error === "PLAN_LIMIT") {
          setToast({ message: `Plan limit (${data.limit})`, type: "error" });
        } else {
          setToast({ message: "Cannot fork", type: "error" });
        }
      } else {
        setToast({ message: "Fork failed", type: "error" });
      }
    } catch {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setForking(false);
    }
  }, [presentationId, forking]);
  const [displayed, setDisplayed] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const scrollingRef = useRef(false);
  const [showReport, setShowReport] = useState(false);
  const [showZoomBadge, setShowZoomBadge] = useState(false);
  const zoomBadgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const pinch = usePinchZoom({ minScale: 0.5, maxScale: 3, boundsWidth: 375, boundsHeight: 667 });

  useEffect(() => {
    if (pinch.scale !== 1) {
      setShowZoomBadge(true);
      if (zoomBadgeTimer.current) clearTimeout(zoomBadgeTimer.current);
      zoomBadgeTimer.current = setTimeout(() => setShowZoomBadge(false), 1000);
    } else {
      setShowZoomBadge(false);
    }
  }, [pinch.scale]);

  useEffect(() => {
    pinch.reset();
  }, [current, pinch.reset]);

  const goNext = useCallback(() => {
    if (animating || current >= total - 1) return;
    setCurrent((c) => c + 1);
  }, [animating, current, total]);

  const goPrev = useCallback(() => {
    if (animating || current <= 0) return;
    setCurrent((c) => c - 1);
  }, [animating, current]);

  const [phase, setPhase] = useState<"idle" | "enter" | "active">("idle");

  useEffect(() => {
    if (current === displayed) return;
    const incomingSlide = slides[current];
    const tr = incomingSlide?.transition ?? "fade";
    if (tr === "none") { setDisplayed(current); return; }
    const ms = incomingSlide?.transitionDuration ?? DEFAULT_TRANSITION_MS;
    setAnimating(true);
    setPhase("enter");
    const raf = requestAnimationFrame(() => setPhase("active"));
    const timer = setTimeout(() => {
      setDisplayed(current);
      setAnimating(false);
      setPhase("idle");
    }, ms);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [current, displayed, slides]);

  function handleTouchStart(e: React.TouchEvent) {
    pinch.handlers.onTouchStart(e);
    if (e.touches.length >= 2) return;
    scrollingRef.current = false;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }

  function handleTouchMove(e: React.TouchEvent) {
    pinch.handlers.onTouchMove(e);
    if (e.touches.length >= 2 || pinch.isZoomed) return;
    if (!touchRef.current) return;
    const dy = Math.abs(e.touches[0].clientY - touchRef.current.y);
    if (dy > 10) scrollingRef.current = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    pinch.handlers.onTouchEnd(e);
    if (pinch.isZoomed) { touchRef.current = null; return; }
    if (!touchRef.current || scrollingRef.current) { touchRef.current = null; return; }
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const elapsed = Date.now() - touchRef.current.t;
    touchRef.current = null;
    if (Math.abs(dx) > 30 && elapsed < 500) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  const incoming = slides[current];
  const outgoing = slides[displayed];
  if (!incoming && !outgoing) return null;

  const activeSlide = incoming ?? outgoing;
  const transType = incoming?.transition ?? "fade";
  const transMs = incoming?.transitionDuration ?? DEFAULT_TRANSITION_MS;
  const transEase = incoming?.transitionEasing ?? "ease";
  const dir = current > displayed ? 1 : -1;

  function getStyle(role: "in" | "out"): React.CSSProperties {
    if (!animating) return {};
    const dur = `${transMs}ms`;
    const ease = transEase;
    const isEntering = phase === "enter";

    if (transType === "fade") {
      if (role === "in") {
        return { transition: isEntering ? "none" : `opacity ${dur} ${ease}`, opacity: isEntering ? 0 : 1 };
      }
      return { transition: `opacity ${dur} ${ease}`, opacity: 0 };
    }
    if (transType === "slide-left") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: isEntering ? `translateX(${dir * 30}%)` : "translateX(0)",
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: `translateX(${-dir * 30}%)`,
        opacity: 0,
      };
    }
    if (transType === "slide-up") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: isEntering ? "translateY(30%)" : "translateY(0)",
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: "translateY(-15%)",
        opacity: 0,
      };
    }
    if (transType === "zoom") {
      if (role === "in") {
        return {
          transition: isEntering ? "none" : `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
          transform: isEntering ? "scale(0.85)" : "scale(1)",
          opacity: isEntering ? 0 : 1,
        };
      }
      return {
        transition: `transform ${dur} ${ease}, opacity ${dur} ${ease}`,
        transform: "scale(1.15)",
        opacity: 0,
      };
    }
    return {};
  }

  const inElements = activeSlide.mobileElements ?? activeSlide.elements;

  return (
    <div
      className="relative flex flex-col bg-black select-none"
      style={{ height: "100dvh" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex-1" style={{ overflow: animating ? "visible" : "hidden" }}>
        {/* Free tier watermark */}
        {showWatermark && (
          <div className="pointer-events-none absolute top-3 right-3 z-10">
            <span className="rounded bg-black/40 px-2 py-0.5 text-[9px] font-medium tracking-[0.2em] text-white/50 uppercase backdrop-blur-sm">
              Made with Folio
            </span>
          </div>
        )}
        {/* Outgoing slide */}
        {animating && outgoing && (
          <div className="absolute inset-0" style={getStyle("out")}>
            <div
              className="h-full overflow-y-auto overscroll-contain pb-14"
              style={{ background: mobileBg(outgoing) }}
            >
              <MobileSlideContent elements={outgoing.mobileElements ?? outgoing.elements} bg={mobileBg(outgoing)} />
            </div>
          </div>
        )}
        {/* Current slide */}
        <div className="absolute inset-0" style={getStyle("in")}>
          <div
            className="h-full overflow-y-auto overscroll-contain pb-14"
            style={{
              background: mobileBg(activeSlide),
              transform: `translate(${pinch.offsetX}px, ${pinch.offsetY}px) scale(${pinch.scale})`,
              transformOrigin: "center center",
              willChange: pinch.isZoomed ? "transform" : "auto",
            }}
          >
            <MobileSlideContent animateKey={animating ? -1 : current} elements={inElements} bg={mobileBg(activeSlide)} />
          </div>
        </div>
        {/* Zoom level badge */}
        {showZoomBadge && pinch.scale !== 1 && (
          <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-opacity duration-300">
            {pinch.scale.toFixed(1)}x
          </div>
        )}
      </div>

      {recordingUrl && recordingTimeline && recordingDuration && (
        <div className="shrink-0 px-3 py-2 bg-black border-t border-white/10">
          <RecordingPlayer
            recordingUrl={recordingUrl}
            timeline={recordingTimeline}
            duration={recordingDuration}
            onSlideChange={setCurrent}
          />
        </div>
      )}

      {/* Fixed bottom bar */}
      <div className="shrink-0 border-t border-white/10 bg-black safe-b">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="max-w-[40%] truncate text-[10px] text-white/50">{title}</span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/70">{current + 1} / {total}</span>
            <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-white/70 transition-all duration-300"
                style={{ width: `${((current + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-1.5">
          <a
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-white/30 active:text-white/50"
          >
            Folio
          </a>
          <div className="flex items-center gap-3">
            {localForkCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" />
                </svg>
                {localForkCount}
              </span>
            )}
            {presentationId && (
              <button
                onClick={handleFork}
                disabled={forking}
                className="flex h-8 items-center gap-1 rounded-full bg-white/10 px-3 text-[10px] text-white/60 active:bg-white/20 disabled:opacity-50"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" />
                </svg>
                {forking ? "..." : "Fork"}
              </button>
            )}
          </div>
        </div>
      </div>

      {presentationId && (
        <button
          onClick={() => setShowReport(true)}
          className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/40 active:bg-white/20"
          aria-label="Report content"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {toast && (
        <div className={`absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-3 py-1.5 text-[10px] font-medium backdrop-blur-sm ${
          toast.type === "success" ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Swipe hint */}
      {current === 0 && total > 1 && (
        <div className="absolute inset-x-0 bottom-20 z-10 flex justify-center pointer-events-none animate-fade-out">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] text-white/50">
            {t.viewer.swipeHint}
          </span>
        </div>
      )}
    </div>
  );
}

function MobileSlideContent({ elements, bg, animateKey }: { elements: SlideElement[]; bg: string; animateKey?: number }) {
  const sorted = useMemo(() => {
    const titles: SlideElement[] = [];
    const images: SlideElement[] = [];
    const body: SlideElement[] = [];
    const decorative: SlideElement[] = [];

    for (const el of elements) {
      if (el.visible === false) continue;
      if (el.type === "text" && el.fontSize >= 48) titles.push(el);
      else if (el.type === "image") images.push(el);
      else if (el.type === "text" && el.opacity > 0.2) body.push(el);
      else if (el.type === "divider") decorative.push(el);
      else if (el.type === "shape") decorative.push(el);
    }

    titles.sort((a, b) => {
      const fa = a.type === "text" ? a.fontSize : 0;
      const fb = b.type === "text" ? b.fontSize : 0;
      return fb - fa;
    });

    return [...titles, ...images, ...body, ...decorative];
  }, [elements]);

  const shouldAnimate = animateKey !== undefined && animateKey >= 0;

  return (
    <div className="min-h-full px-5 py-8 space-y-4" style={{ background: bg }}>
      {sorted.map((el, i) => (
        <MobileElement
          key={shouldAnimate ? `${el.id}-${animateKey}` : el.id}
          element={el}
          delay={shouldAnimate ? i * 80 : 0}
          animate={shouldAnimate}
        />
      ))}
    </div>
  );
}

function MobileElement({ element, delay = 0, animate = true }: { element: SlideElement; delay?: number; animate?: boolean }) {
  const totalDelay = (element.animationDelay ?? 0) + delay;
  const animStyle = animate ? getElementAnimationStyle(element.animation, totalDelay, element.animationDuration, element.animationEasing) : {};
  if (element.type === "arrow") return null;
  if (element.type === "line") return null;

  if (element.type === "shape") {
    return <div style={animStyle}><MobileShape element={element} /></div>;
  }

  if (element.type === "divider") {
    return (
      <div className="py-2" style={animStyle}>
        <div style={{ height: element.strokeWidth, backgroundColor: element.color, opacity: element.opacity }} />
      </div>
    );
  }

  if (element.type === "image") {
    const hasCrop = (element.cropWidth ?? 1) < 1 || (element.cropHeight ?? 1) < 1 || (element.cropX ?? 0) > 0 || (element.cropY ?? 0) > 0;
    return (
      <div style={{
        ...animStyle,
        clipPath: hasCrop
          ? `inset(${(element.cropY ?? 0) * 100}% ${(1 - (element.cropX ?? 0) - (element.cropWidth ?? 1)) * 100}% ${(1 - (element.cropY ?? 0) - (element.cropHeight ?? 1)) * 100}% ${(element.cropX ?? 0) * 100}%)`
          : undefined,
      }}>
        <img
          src={element.src}
          alt=""
          loading="lazy"
          className="w-full rounded"
          style={{
            aspectRatio: `${element.w} / ${element.h}`,
            objectFit: "cover",
            filter: element.filter || undefined,
          }}
          draggable={false}
        />
      </div>
    );
  }

  if (element.type === "text") {
    return <div style={animStyle}><MobileText element={element} /></div>;
  }

  if (element.type === "table") {
    return <div style={animStyle} className="w-full overflow-x-auto"><MobileTable element={element} /></div>;
  }

  if (element.type === "icon") {
    return (
      <div style={{ ...animStyle, width: 48, height: 48 }} className="mx-auto">
        <IconRenderer element={element} />
      </div>
    );
  }

  if (element.type === "video") {
    return (
      <div style={{ ...animStyle, aspectRatio: `${element.w} / ${element.h}` }} className="w-full rounded overflow-hidden">
        <VideoRenderer element={element} mode="viewer" />
      </div>
    );
  }

  return null;
}

function shapeFillBg(element: ShapeElement): React.CSSProperties {
  if (element.fillGradient && element.fillGradient.stops.length >= 2) {
    return { background: gradientToCSS(element.fillGradient) };
  }
  return { backgroundColor: element.fill };
}

function MobileShape({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div className="flex justify-center py-2">
        <div style={{ width: 48, height: 48, borderRadius: "50%", ...shapeFillBg(element), opacity: element.opacity }} />
      </div>
    );
  }
  return (
    <div className="py-1">
      <div style={{ height: 4, borderRadius: element.borderRadius, ...shapeFillBg(element), opacity: element.opacity }} />
    </div>
  );
}

function MobileText({ element }: { element: TextElement }) {
  const isTitle = element.fontSize >= 48;
  const mobileFontSize = isTitle
    ? Math.min(element.fontSize * 0.5, 56)
    : Math.max(element.fontSize * 0.85, 14);

  const sanitized = useMemo(() => DOMPurify.sanitize(element.content), [element.content]);

  return (
    <div
      style={{
        fontFamily: element.fontFamily,
        fontSize: mobileFontSize,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle ?? "normal",
        textDecoration: element.textDecoration ?? "none",
        WebkitTextStroke: element.textStroke ? `${element.textStroke.width}px ${element.textStroke.color}` : undefined,
        lineHeight: isTitle ? 1.1 : 1.6,
        letterSpacing: `${element.letterSpacing}em`,
        color: element.color,
        textShadow: textShadowCSS(element.textShadow),
        opacity: element.opacity,
      }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

function MobileTable({ element }: { element: TableElement }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: Math.min(element.fontSize, 14),
      }}
    >
      <tbody>
        {element.cells.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  border: `1px solid ${element.borderColor}`,
                  padding: Math.min(element.cellPadding, 6),
                  backgroundColor: element.headerRow && ri === 0 ? element.headerBgColor : "transparent",
                  color: element.headerRow && ri === 0 ? "#ffffff" : "inherit",
                  fontWeight: element.headerRow && ri === 0 ? 600 : 400,
                  wordBreak: "break-word",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
