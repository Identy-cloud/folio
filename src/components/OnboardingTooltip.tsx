"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getClipPath(r: TargetRect, pad: number): string {
  const t = Math.max(0, r.top - pad);
  const l = Math.max(0, r.left - pad);
  const b = r.top + r.height + pad;
  const ri = r.left + r.width + pad;
  return `polygon(0% 0%, 0% 100%, ${l}px 100%, ${l}px ${t}px, ${ri}px ${t}px, ${ri}px ${b}px, ${l}px ${b}px, ${l}px 100%, 100% 100%, 100% 0%)`;
}

export function OnboardingTooltip({
  target, title, description, position,
  stepNumber, totalSteps, onNext, onPrevious, onSkip,
}: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = document.querySelector(target);
    if (!el) {
      setRect(null);
      return;
    }
    const bounds = el.getBoundingClientRect();
    const r: TargetRect = { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height };
    setRect(r);

    requestAnimationFrame(() => {
      const tip = tooltipRef.current;
      if (!tip) return;
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const gap = 12;
      let top = 0;
      let left = 0;

      if (position === "bottom") {
        top = r.top + r.height + gap;
        left = r.left + r.width / 2 - tw / 2;
      } else if (position === "top") {
        top = r.top - th - gap;
        left = r.left + r.width / 2 - tw / 2;
      } else if (position === "left") {
        top = r.top + r.height / 2 - th / 2;
        left = r.left - tw - gap;
      } else {
        top = r.top + r.height / 2 - th / 2;
        left = r.left + r.width + gap;
      }

      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - th - 8));
      setTooltipPos({ top, left });
    });
  }, [target, position]);

  const arrowMap = {
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-[#1e1e1e] border-x-transparent border-t-transparent",
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-[#1e1e1e] border-x-transparent border-b-transparent",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-[#1e1e1e] border-y-transparent border-r-transparent",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-[#1e1e1e] border-y-transparent border-l-transparent",
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-[clip-path] duration-300"
        onClick={onSkip}
        style={rect ? { clipPath: getClipPath(rect, 6) } : undefined}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute w-[calc(100%-2rem)] max-w-xs rounded-lg bg-[#1e1e1e] border border-neutral-700 p-4 shadow-2xl"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Arrow */}
        <span className={`absolute border-[6px] ${arrowMap[position]}`} />

        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
            {stepNumber} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-[10px] text-neutral-500 hover:text-neutral-300 min-h-[44px] min-w-[44px] flex items-center justify-end"
          >
            Skip
          </button>
        </div>

        <h3 className="font-display text-base tracking-tight text-neutral-200 uppercase">
          {title}
        </h3>
        <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
          {description}
        </p>

        <div className="mt-3 flex gap-2">
          {stepNumber > 1 && (
            <button
              onClick={onPrevious}
              className="flex-1 rounded border border-neutral-600 py-2 text-[10px] font-medium tracking-widest text-neutral-300 uppercase hover:bg-neutral-800 min-h-[44px]"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="flex-1 rounded bg-white py-2 text-[10px] font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 min-h-[44px]"
          >
            {stepNumber >= totalSteps ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
