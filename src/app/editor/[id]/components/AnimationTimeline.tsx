"use client";

import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { AnimationTimelineBar } from "./AnimationTimelineBar";
import { Play, X } from "@phosphor-icons/react";
import type { SlideElement } from "@/types/elements";

const TOTAL_MS = 5000;
const PX_PER_SEC = 100;
const PX_PER_MS = PX_PER_SEC / 1000;
const TOTAL_WIDTH = TOTAL_MS * PX_PER_MS;

interface Props {
  onClose: () => void;
}

export function AnimationTimeline({ onClose }: Props) {
  const slides = useEditorStore((s) => s.slides);
  const activeIndex = useEditorStore((s) => s.activeSlideIndex);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const slide = slides[activeIndex];
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<number | null>(null);
  const [playhead, setPlayhead] = useState(0);

  const animatedElements = (slide?.elements ?? []).filter(
    (el) => el.animation && el.animation !== "none"
  );

  const handleDelayChange = useCallback((id: string, delay: number) => {
    useEditorStore.getState().updateElement(id, { animationDelay: delay } as Partial<SlideElement>);
  }, []);

  const handleDurationChange = useCallback((id: string, duration: number) => {
    useEditorStore.getState().updateElement(id, { animationDuration: duration } as Partial<SlideElement>);
  }, []);

  const handleSelect = useCallback((id: string) => {
    useEditorStore.getState().selectElement(id);
  }, []);

  const handlePlay = useCallback(() => {
    if (playing) {
      if (playRef.current) cancelAnimationFrame(playRef.current);
      setPlaying(false);
      setPlayhead(0);
      return;
    }
    setPlaying(true);
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= TOTAL_MS) {
        setPlaying(false);
        setPlayhead(0);
        return;
      }
      setPlayhead(elapsed);
      playRef.current = requestAnimationFrame(tick);
    };
    playRef.current = requestAnimationFrame(tick);
  }, [playing]);

  const ticks = Array.from({ length: TOTAL_MS / 1000 + 1 }, (_, i) => i);

  return (
    <div className="hidden md:flex flex-col border-t border-neutral-800 bg-[#161616]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            aria-label={playing ? "Stop" : "Play animations"}
          >
            <Play size={14} weight={playing ? "fill" : "regular"} />
          </button>
          <span className="text-xs text-neutral-400 font-medium">
            Animation Timeline
          </span>
          {animatedElements.length === 0 && (
            <span className="text-xs text-neutral-500">— no animated elements</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
          aria-label="Close timeline"
        >
          <X size={14} />
        </button>
      </div>

      <div className="relative overflow-x-auto px-3 py-2" style={{ minHeight: "80px" }}>
        <div className="relative" style={{ width: `${TOTAL_WIDTH}px`, minHeight: `${Math.max(animatedElements.length * 36, 36)}px` }}>
          {ticks.map((s) => (
            <div key={s} className="absolute top-0 bottom-0 border-l border-neutral-700/50" style={{ left: `${s * PX_PER_SEC}px` }}>
              <span className="absolute -top-0.5 left-1 text-[9px] text-neutral-500">{s}s</span>
            </div>
          ))}

          {animatedElements.map((el, i) => (
            <div key={el.id} className="relative" style={{ top: `${i * 36 + 12}px`, height: "32px" }}>
              <AnimationTimelineBar
                element={el}
                pxPerMs={PX_PER_MS}
                onDelayChange={handleDelayChange}
                onDurationChange={handleDurationChange}
                onSelect={handleSelect}
                isSelected={selectedIds.includes(el.id)}
              />
            </div>
          ))}

          {playing && (
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none"
              style={{ left: `${playhead * PX_PER_MS}px` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
