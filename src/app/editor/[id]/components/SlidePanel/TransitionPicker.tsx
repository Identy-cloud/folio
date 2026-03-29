"use client";

import type { SlideTransition } from "@/types/elements";
import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  current: SlideTransition;
  onChange: (t: SlideTransition) => void;
}

export function TransitionPicker({ current, onChange }: Props) {
  const { t } = useTranslation();

  const LABELS: Record<SlideTransition, string> = {
    none: t.editor.noTransition,
    fade: t.editor.fade,
    "slide-left": t.editor.slideLeft,
    "slide-up": t.editor.slideUp,
    zoom: t.editor.zoom,
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
    </div>
  );
}
