"use client";

import type { SlideTransition } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  current: SlideTransition;
  onChange: (t: SlideTransition) => void;
}

export function TransitionPicker({ current, onChange }: Props) {
  const { t } = useTranslation();

  const TRANSITIONS: { id: SlideTransition; label: string; icon: string }[] = [
    { id: "none", label: t.editor.noTransition, icon: "—" },
    { id: "fade", label: t.editor.fade, icon: "◐" },
    { id: "slide-left", label: t.editor.slideLeft, icon: "→" },
    { id: "slide-up", label: t.editor.slideUp, icon: "↑" },
    { id: "zoom", label: t.editor.zoom, icon: "⊕" },
  ];

  return (
    <div className="px-4 py-2">
      <span className="mb-1.5 block text-[10px] text-neutral-500 uppercase tracking-wider">
        {t.editor.transition}
      </span>
      <div className="flex gap-1">
        {TRANSITIONS.map((tr) => (
          <button
            key={tr.id}
            onClick={() => onChange(tr.id)}
            title={tr.label}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              current === tr.id
                ? "bg-white text-[#161616]"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            {tr.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
