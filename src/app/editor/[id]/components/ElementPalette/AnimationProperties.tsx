"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, ElementAnimation } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

const ANIMATIONS: { id: ElementAnimation; label: string }[] = [
  { id: "none", label: "—" },
  { id: "fade-up", label: "↑" },
  { id: "fade-down", label: "↓" },
  { id: "fade-left", label: "←" },
  { id: "fade-right", label: "→" },
  { id: "zoom-in", label: "⊕" },
];

interface Props {
  element: SlideElement;
}

export function AnimationProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [delay, setDelay] = useState(String(element.animationDelay ?? 0));

  useEffect(() => setDelay(String(element.animationDelay ?? 0)), [element.animationDelay]);

  const current = element.animation ?? "fade-up";

  function setAnimation(anim: ElementAnimation) {
    updateElement(element.id, { animation: anim });
    pushHistory();
  }

  function commitDelay() {
    const n = parseInt(delay, 10);
    if (!isNaN(n) && n >= 0) {
      updateElement(element.id, { animationDelay: n });
      pushHistory();
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.transition}
      </span>
      <div className="flex gap-1">
        {ANIMATIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAnimation(a.id)}
            title={a.id}
            className={`flex h-7 flex-1 items-center justify-center rounded border text-xs transition-colors ${
              current === a.id
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-neutral-700 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {current !== "none" && (
        <label className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">Delay</span>
          <input
            type="number"
            min={0}
            max={3000}
            step={50}
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            onBlur={commitDelay}
            onKeyDown={(e) => e.key === "Enter" && commitDelay()}
            className="w-16 rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
          />
          <span className="text-[10px] text-neutral-600">ms</span>
        </label>
      )}
    </div>
  );
}
