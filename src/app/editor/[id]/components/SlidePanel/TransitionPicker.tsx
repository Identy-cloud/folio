"use client";

import type { SlideTransition } from "@/types/elements";
import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  current: SlideTransition;
  onChange: (t: SlideTransition) => void;
  duration?: number;
  onDurationChange?: (d: number) => void;
}

export function TransitionPicker({ current, onChange, duration, onDurationChange }: Props) {
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
      {onDurationChange && (
        <label className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">Auto-advance</span>
          <select
            value={duration ?? 0}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            className="rounded border border-neutral-700 bg-[#161616] px-1.5 py-1 text-[10px] text-neutral-300 outline-none"
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
