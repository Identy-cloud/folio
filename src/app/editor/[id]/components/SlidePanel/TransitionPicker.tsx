"use client";

import type { SlideTransition } from "@/types/elements";

const TRANSITIONS: { id: SlideTransition; label: string; icon: string }[] = [
  { id: "none", label: "Sin transición", icon: "—" },
  { id: "fade", label: "Fade", icon: "◐" },
  { id: "slide-left", label: "Slide", icon: "→" },
  { id: "slide-up", label: "Slide arriba", icon: "↑" },
  { id: "zoom", label: "Zoom", icon: "⊕" },
];

interface Props {
  current: SlideTransition;
  onChange: (t: SlideTransition) => void;
}

export function TransitionPicker({ current, onChange }: Props) {
  return (
    <div className="px-4 py-2">
      <span className="mb-1.5 block text-[10px] text-neutral-500 uppercase tracking-wider">
        Transición
      </span>
      <div className="flex gap-1">
        {TRANSITIONS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            title={t.label}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              current === t.id
                ? "bg-white text-[#161616]"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
