"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement, ShapeElement, SlideTransition } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Slide {
  id: string;
  transition: SlideTransition;
  backgroundColor: string;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
}

const TRANSITION_MS = 350;

export function MobileViewer({ title, slides }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const scrollingRef = useRef(false);
  const total = slides.length;

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
    const tr = slides[current]?.transition ?? "fade";
    if (tr === "none") { setDisplayed(current); return; }
    setAnimating(true);
    setPhase("enter");
    const raf = requestAnimationFrame(() => setPhase("active"));
    const timer = setTimeout(() => {
      setDisplayed(current);
      setAnimating(false);
      setPhase("idle");
    }, TRANSITION_MS);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [current, displayed, slides]);

  function handleTouchStart(e: React.TouchEvent) {
    scrollingRef.current = false;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const dy = Math.abs(e.touches[0].clientY - touchRef.current.y);
    if (dy > 10) scrollingRef.current = true;
  }

  function handleTouchEnd(e: React.TouchEvent) {
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
  const dir = current > displayed ? 1 : -1;

  function getStyle(role: "in" | "out"): React.CSSProperties {
    if (!animating) return {};
    const dur = `${TRANSITION_MS}ms`;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
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
        {/* Outgoing slide */}
        {animating && outgoing && (
          <div className="absolute inset-0" style={getStyle("out")}>
            <div
              className="h-full overflow-y-auto overscroll-contain pb-14"
              style={{ backgroundColor: outgoing.backgroundColor }}
            >
              <MobileSlideContent elements={outgoing.mobileElements ?? outgoing.elements} bg={outgoing.backgroundColor} />
            </div>
          </div>
        )}
        {/* Current slide */}
        <div className="absolute inset-0" style={getStyle("in")}>
          <div
            className="h-full overflow-y-auto overscroll-contain pb-14"
            style={{ backgroundColor: activeSlide.backgroundColor }}
          >
            <MobileSlideContent elements={inElements} bg={activeSlide.backgroundColor} />
          </div>
        </div>
      </div>

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
        <a
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="block border-t border-white/5 px-4 py-1.5 text-center text-[10px] text-white/30 active:text-white/50"
        >
          {t.viewer.createOwn}
        </a>
      </div>

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

function MobileSlideContent({ elements, bg }: { elements: SlideElement[]; bg: string }) {
  const sorted = useMemo(() => {
    const titles: SlideElement[] = [];
    const images: SlideElement[] = [];
    const body: SlideElement[] = [];
    const decorative: SlideElement[] = [];

    for (const el of elements) {
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

  return (
    <div className="min-h-full px-5 py-8 space-y-4" style={{ backgroundColor: bg }}>
      {sorted.map((el) => (
        <MobileElement key={el.id} element={el} />
      ))}
    </div>
  );
}

function MobileElement({ element }: { element: SlideElement }) {
  if (element.type === "arrow") return null;

  if (element.type === "shape") {
    return <MobileShape element={element} />;
  }

  if (element.type === "divider") {
    return (
      <div className="py-2">
        <div style={{ height: element.strokeWidth, backgroundColor: element.color, opacity: element.opacity }} />
      </div>
    );
  }

  if (element.type === "image") {
    return (
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
    );
  }

  if (element.type === "text") {
    return <MobileText element={element} />;
  }

  return null;
}

function MobileShape({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div className="flex justify-center py-2">
        <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: element.fill, opacity: element.opacity }} />
      </div>
    );
  }
  return (
    <div className="py-1">
      <div style={{ height: 4, borderRadius: element.borderRadius, backgroundColor: element.fill, opacity: element.opacity }} />
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
        lineHeight: isTitle ? 1.1 : 1.6,
        letterSpacing: `${element.letterSpacing}em`,
        color: element.color,
        opacity: element.opacity,
      }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
