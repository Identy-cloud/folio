"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { LineElement } from "@/types/elements";

interface Props { element: LineElement }

export function LineProperties({ element }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [strokeW, setStrokeW] = useState(String(element.strokeWidth));

  useEffect(() => setStrokeW(String(element.strokeWidth)), [element.strokeWidth]);

  function update(u: Partial<LineElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  return (
    <div className="space-y-3">
      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
        Line / Connector
      </span>

      <ColorPicker
        label="Stroke"
        value={element.strokeColor}
        onChange={(c) => update({ strokeColor: c })}
      />

      <div>
        <span className="mb-1 block text-[10px] text-neutral-500">Style</span>
        <div className="flex gap-1">
          {(["solid", "dashed", "dotted"] as const).map((d) => (
            <button
              key={d}
              onClick={() => update({ strokeDash: d })}
              className={`flex-1 rounded px-2 py-1 text-[10px] transition-colors ${
                element.strokeDash === d
                  ? "bg-white text-[#161616]"
                  : "text-neutral-500 hover:bg-neutral-800"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">Stroke width</span>
        <input
          type="number"
          min={1}
          max={20}
          value={strokeW}
          onChange={(e) => setStrokeW(e.target.value)}
          onBlur={() => {
            const n = parseInt(strokeW, 10);
            if (!isNaN(n)) update({ strokeWidth: n });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const n = parseInt(strokeW, 10);
              if (!isNaN(n)) update({ strokeWidth: n });
            }
          }}
          className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
        />
      </label>

      <div>
        <span className="mb-1 block text-[10px] text-neutral-500">Arrows</span>
        <div className="flex gap-2">
          <label className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <input
              type="checkbox"
              checked={element.arrowStart}
              onChange={(e) => update({ arrowStart: e.target.checked })}
              className="rounded"
            />
            Start
          </label>
          <label className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <input
              type="checkbox"
              checked={element.arrowEnd}
              onChange={(e) => update({ arrowEnd: e.target.checked })}
              className="rounded"
            />
            End
          </label>
        </div>
      </div>
    </div>
  );
}
