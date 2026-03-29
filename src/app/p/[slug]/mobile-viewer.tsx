"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import DOMPurify from "dompurify";
import type { SlideElement, TextElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Slide {
  id: string;
  backgroundColor: string;
  elements: SlideElement[];
  mobileElements?: SlideElement[] | null;
}

interface Props {
  title: string;
  slides: Slide[];
}

export function MobileViewer({ title, slides }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;

  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

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

  const slide = slides[current];
  if (!slide) return null;

  const elements = slide.mobileElements ?? slide.elements;

  return (
    <div
      className="relative h-screen bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="h-full overflow-y-auto pb-20"
        style={{ backgroundColor: slide.backgroundColor }}
      >
        <MobileSlideContent elements={elements} bg={slide.backgroundColor} />
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="max-w-[40%] truncate text-[10px] text-white/40">{title}</span>
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
        <a
          href="/"
          className="block border-t border-white/5 px-4 py-2 text-center text-[10px] text-white/30 active:text-white/50"
        >
          {t.viewer.createOwn}
        </a>
      </div>

      {/* Swipe hint */}
      {current === 0 && (
        <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center pointer-events-none animate-fade-out">
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

    for (const el of elements) {
      if (el.type === "text" && el.fontSize >= 48) titles.push(el);
      else if (el.type === "image") images.push(el);
      else if (el.type === "text" && el.opacity > 0.2) body.push(el);
    }

    titles.sort((a, b) => {
      const fa = a.type === "text" ? a.fontSize : 0;
      const fb = b.type === "text" ? b.fontSize : 0;
      return fb - fa;
    });

    return [...titles, ...images, ...body];
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
  if (element.type === "shape" || element.type === "arrow") return null;

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

function MobileText({ element }: { element: TextElement }) {
  const isTitle = element.fontSize >= 48;
  const mobileFontSize = isTitle
    ? Math.min(element.fontSize * 0.4, 48)
    : Math.max(element.fontSize * 0.75, 14);

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
