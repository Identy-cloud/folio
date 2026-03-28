"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { DividerElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Props { element: DividerElement }

export function DividerProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [strokeW, setStrokeW] = useState(String(element.strokeWidth));

  useEffect(() => setStrokeW(String(element.strokeWidth)), [element.strokeWidth]);

  function update(u: Partial<DividerElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.line}
      </span>

      <ColorPicker label={t.editor.color} value={element.color} onChange={(c) => update({ color: c })} />

      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">{t.editor.strokeWidth}</span>
        <input
          type="number"
          min={1} max={20}
          value={strokeW}
          onChange={(e) => setStrokeW(e.target.value)}
          onBlur={() => { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); }}
          onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(strokeW, 10); if (!isNaN(n)) update({ strokeWidth: n }); } }}
          className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
        />
      </label>
    </div>
  );
}
