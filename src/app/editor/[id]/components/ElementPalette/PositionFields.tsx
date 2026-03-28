"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  element: SlideElement;
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [local, setLocal] = useState(String(Math.round(value)));
  useEffect(() => setLocal(String(Math.round(value))), [value]);

  function commit() {
    const n = parseFloat(local);
    if (!isNaN(n)) onChange(n);
  }

  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-[10px] text-neutral-500">{label}</span>
      <input
        type="number"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
      />
    </label>
  );
}

export function PositionFields({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  function update(updates: Partial<SlideElement>) {
    updateElement(element.id, updates);
    pushHistory();
  }

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.position}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={element.x} onChange={(v) => update({ x: v })} />
        <NumField label="Y" value={element.y} onChange={(v) => update({ y: v })} />
        <NumField label="W" value={element.w} onChange={(v) => update({ w: v })} />
        <NumField label="H" value={element.h} onChange={(v) => update({ h: v })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={t.editor.rotation} value={element.rotation} onChange={(v) => update({ rotation: v })} />
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">{t.editor.opacity}</span>
          <input
            type="range"
            min={0} max={1} step={0.05}
            value={element.opacity}
            onChange={(e) => updateElement(element.id, { opacity: parseFloat(e.target.value) })}
            onMouseUp={pushHistory}
            onTouchEnd={pushHistory}
            className="w-full accent-white"
          />
        </label>
      </div>
    </div>
  );
}
