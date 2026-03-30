"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { ShapeElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Props { element: ShapeElement }

export function ShapeProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [strokeW, setStrokeW] = useState(String(element.strokeWidth));
  const [radius, setRadius] = useState(String(element.borderRadius));

  useEffect(() => setStrokeW(String(element.strokeWidth)), [element.strokeWidth]);
  useEffect(() => setRadius(String(element.borderRadius)), [element.borderRadius]);

  function update(u: Partial<ShapeElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  return (
    <div className="space-y-3">
      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">{t.editor.shape}</span>

      <ColorPicker label={t.editor.fill} value={element.fill} onChange={(c) => update({ fill: c })} />
      <ColorPicker label={t.editor.stroke} value={element.stroke} onChange={(c) => update({ stroke: c })} />

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">{t.editor.strokeWidth}</span>
          <input
            type="number"
            min={0} max={20}
            value={strokeW}
            onChange={(e) => setStrokeW(e.target.value)}
            onBlur={() => { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); }}
            onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); } }}
            className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
          />
        </label>
        {element.shape === "rect" && (
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-500">{t.editor.borderRadius}</span>
            <input
              type="number"
              min={0}
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              onBlur={() => { const n = parseInt(radius, 10); if (!isNaN(n)) update({ borderRadius: n }); }}
              onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(radius, 10); if (!isNaN(n)) update({ borderRadius: n }); } }}
              className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
            />
          </label>
        )}
      </div>
    </div>
  );
}
