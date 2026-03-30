"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SlideTransition, TransitionEasing } from "@/types/elements";
import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";
import { useTranslation } from "@/lib/i18n/context";

const EASING_OPTIONS: TransitionEasing[] = ["ease", "ease-in", "ease-out", "ease-in-out", "linear"];

const EASING_LABELS: Record<TransitionEasing, string> = {
  ease: "Ease",
  "ease-in": "In",
  "ease-out": "Out",
  "ease-in-out": "In-Out",
  linear: "Linear",
};

interface Props {
  current: SlideTransition;
  onChange: (t: SlideTransition) => void;
  duration?: number;
  onDurationChange?: (d: number) => void;
  transitionDuration?: number;
  onTransitionDurationChange?: (ms: number) => void;
  transitionEasing?: TransitionEasing;
  onTransitionEasingChange?: (e: TransitionEasing) => void;
}

export function TransitionPicker({
  current,
  onChange,
  duration,
  onDurationChange,
  transitionDuration,
  onTransitionDurationChange,
  transitionEasing,
  onTransitionEasingChange,
}: Props) {
  const { t } = useTranslation();

  const LABELS: Record<SlideTransition, string> = {
    none: t.editor.noTransition,
    fade: t.editor.fade,
    "slide-left": t.editor.slideLeft,
    "slide-right": "Slide Right",
    "slide-up": t.editor.slideUp,
    zoom: t.editor.zoom,
    blur: "Blur",
  };

  const effectiveDuration = transitionDuration ?? 500;
  const effectiveEasing = transitionEasing ?? "ease";
  const showTimingControls = current !== "none" && onTransitionDurationChange;

  return (
    <div className="px-4 py-2">
      <span className="mb-1.5 block text-[10px] text-neutral-500 uppercase tracking-wider">
        {t.editor.transition}
      </span>
      <div className="flex gap-1">
        {TRANSITION_LIST.map((tr) => (
          <button
            key={tr}
            onClick={() => onChange(tr)}
            title={LABELS[tr]}
            className={`flex h-8 w-8 items-center justify-center rounded text-xs transition-colors ${
              current === tr
                ? "bg-white text-[#161616]"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <TransitionIcon type={tr} size={14} />
          </button>
        ))}
      </div>

      {showTimingControls && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[10px] text-neutral-500 w-12">Speed</span>
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={effectiveDuration}
              onChange={(e) => onTransitionDurationChange(parseInt(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-700 accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <input
              type="number"
              min={200}
              max={2000}
              step={100}
              value={effectiveDuration}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v)) onTransitionDurationChange(Math.max(200, Math.min(2000, v)));
              }}
              className="w-14 rounded border border-neutral-700 bg-[#161616] px-1.5 py-0.5 text-right text-[10px] text-neutral-300 outline-none tabular-nums"
            />
            <span className="text-[10px] text-neutral-500">ms</span>
          </div>

          {onTransitionEasingChange && (
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[10px] text-neutral-500 w-12">Easing</span>
              <div className="flex flex-1 gap-0.5">
                {EASING_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => onTransitionEasingChange(e)}
                    className={`flex-1 rounded px-1 py-1 text-[9px] transition-colors ${
                      effectiveEasing === e
                        ? "bg-white text-[#161616] font-medium"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    }`}
                    title={e}
                  >
                    {EASING_LABELS[e]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <TransitionPreview
            transition={current}
            duration={effectiveDuration}
            easing={effectiveEasing}
          />
        </div>
      )}

      {onDurationChange && (
        <label className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">Auto-advance</span>
          <select
            value={duration ?? 0}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            className="cursor-pointer rounded border border-neutral-700 bg-[#161616] px-1.5 py-1 text-[10px] text-neutral-300 outline-none"
          >
            <option value={0}>Off</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={8}>8s</option>
            <option value={10}>10s</option>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
          </select>
        </label>
      )}
    </div>
  );
}

function TransitionPreview({
  transition,
  duration,
  easing,
}: {
  transition: SlideTransition;
  duration: number;
  easing: TransitionEasing;
}) {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "active">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function play() {
    if (playing) return;
    cleanup();
    setPlaying(true);
    setPhase("enter");

    rafRef.current = requestAnimationFrame(() => {
      setPhase("active");
    });

    timerRef.current = setTimeout(() => {
      setPlaying(false);
      setPhase("idle");
    }, duration + 50);
  }

  const dur = `${duration}ms`;

  function getPreviewStyle(): React.CSSProperties {
    if (!playing || phase === "idle") return { opacity: 1 };
    const isEntering = phase === "enter";

    if (transition === "fade") {
      return {
        transition: isEntering ? "none" : `opacity ${dur} ${easing}`,
        opacity: isEntering ? 0 : 1,
      };
    }
    if (transition === "slide-left" || transition === "slide-right") {
      const dir = transition === "slide-left" ? 1 : -1;
      return {
        transition: isEntering ? "none" : `transform ${dur} ${easing}, opacity ${dur} ${easing}`,
        transform: isEntering ? `translateX(${dir * 30}%)` : "translateX(0)",
        opacity: isEntering ? 0 : 1,
      };
    }
    if (transition === "slide-up") {
      return {
        transition: isEntering ? "none" : `transform ${dur} ${easing}, opacity ${dur} ${easing}`,
        transform: isEntering ? "translateY(30%)" : "translateY(0)",
        opacity: isEntering ? 0 : 1,
      };
    }
    if (transition === "zoom") {
      return {
        transition: isEntering ? "none" : `transform ${dur} ${easing}, opacity ${dur} ${easing}`,
        transform: isEntering ? "scale(0.85)" : "scale(1)",
        opacity: isEntering ? 0 : 1,
      };
    }
    if (transition === "blur") {
      return {
        transition: isEntering ? "none" : `opacity ${dur} ${easing}, filter ${dur} ${easing}`,
        opacity: isEntering ? 0 : 1,
        filter: isEntering ? "blur(4px)" : "blur(0px)",
      };
    }
    return { opacity: 1 };
  }

  return (
    <button
      onClick={play}
      className="flex w-full items-center justify-center gap-1.5 rounded bg-neutral-800 px-2 py-1.5 text-[10px] text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
      title="Preview transition"
    >
      <div className="relative h-5 w-8 overflow-hidden rounded-sm bg-neutral-900">
        <div
          className="absolute inset-0 flex items-center justify-center bg-neutral-600 text-[7px] text-white"
          style={getPreviewStyle()}
        >
          A
        </div>
      </div>
      <span>Preview</span>
    </button>
  );
}
