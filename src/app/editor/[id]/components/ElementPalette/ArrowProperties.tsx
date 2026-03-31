"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "@phosphor-icons/react";
import type { ArrowElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Props { element: ArrowElement }

export function ArrowProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [strokeW, setStrokeW] = useState(String(element.strokeWidth));

  useEffect(() => setStrokeW(String(element.strokeWidth)), [element.strokeWidth]);

  function update(u: Partial<ArrowElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  const directions: { value: ArrowElement["direction"]; icon: typeof ArrowRight }[] = [
    { value: "right", icon: ArrowRight },
    { value: "left", icon: ArrowLeft },
    { value: "up", icon: ArrowUp },
    { value: "down", icon: ArrowDown },
  ];

  return (
    <div className="space-y-3">
      <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">
        {t.editor.arrow}
      </span>

      <ColorPicker label={t.editor.color} value={element.color} onChange={(c) => update({ color: c })} />

      <div>
        <span className="mb-1 block text-[10px] text-silver/50">{t.editor.direction}</span>
        <div className="flex gap-1">
          {directions.map((d) => (
            <button
              key={d.value}
              onClick={() => update({ direction: d.value })}
              aria-label={d.value}
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                element.direction === d.value
                  ? "bg-accent text-white"
                  : "text-silver/70 hover:bg-white/5"
              }`}
            >
              <d.icon size={14} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-[10px] text-silver/50">Style</span>
        <div className="flex gap-1">
          {(["solid", "dashed", "dotted"] as const).map((d) => (
            <button
              key={d}
              onClick={() => update({ dashPattern: d })}
              className={`flex-1 rounded px-2 py-1 text-[10px] transition-colors ${
                (element.dashPattern ?? "solid") === d
                  ? "bg-accent text-white"
                  : "text-silver/50 hover:bg-white/5"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-silver/50">{t.editor.strokeWidth}</span>
        <input
          type="number"
          min={1} max={20}
          value={strokeW}
          onChange={(e) => setStrokeW(e.target.value)}
          onBlur={() => { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); }}
          onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); } }}
          className="w-full rounded border border-steel bg-navy px-2 py-1 text-xs text-silver outline-none focus:border-silver/50"
        />
      </label>
    </div>
  );
}
