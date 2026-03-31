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
  { id: "zoom-out", label: "⊖" },
  { id: "rotate-in", label: "↻" },
  { id: "bounce-in", label: "⌁" },
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
      <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">
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
                : "border-steel text-silver/50 hover:border-silver/40 hover:text-silver"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {current !== "none" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <label className="flex items-center gap-1">
              <span className="text-[10px] text-silver/50">Delay</span>
              <input
                type="number"
                min={0}
                max={3000}
                step={50}
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                onBlur={commitDelay}
                onKeyDown={(e) => e.key === "Enter" && commitDelay()}
                className="w-14 rounded border border-steel bg-navy px-1.5 py-1 text-xs text-silver outline-none focus:border-silver/50"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-[10px] text-silver/50">Duration</span>
              <input
                type="number"
                min={100}
                max={3000}
                step={50}
                value={element.animationDuration ?? 500}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n)) { updateElement(element.id, { animationDuration: n }); pushHistory(); }
                }}
                className="w-14 rounded border border-steel bg-navy px-1.5 py-1 text-xs text-silver outline-none focus:border-silver/50"
              />
            </label>
            <span className="text-[10px] text-silver/40 self-center">ms</span>
          </div>
          <div>
            <span className="mb-1 block text-[10px] text-silver/50">Easing</span>
            <div className="flex gap-1">
              {(["ease", "ease-in", "ease-out", "ease-in-out", "linear"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => { updateElement(element.id, { animationEasing: e }); pushHistory(); }}
                  className={`flex-1 rounded px-0.5 py-1 text-[10px] transition-colors ${
                    (element.animationEasing ?? "ease") === e
                      ? "bg-accent text-white"
                      : "text-silver/50 hover:bg-white/5"
                  }`}
                >
                  {e.replace("ease-", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
