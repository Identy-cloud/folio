"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { LinkSimple, LinkSimpleBreak } from "@phosphor-icons/react";
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
  const locked = element.aspectRatioLocked === true;
  const aspect = element.w / element.h;

  function update(updates: Partial<SlideElement>) {
    updateElement(element.id, updates);
    pushHistory();
  }

  function updateW(v: number) {
    if (locked) update({ w: v, h: Math.round(v / aspect) });
    else update({ w: v });
  }

  function updateH(v: number) {
    if (locked) update({ h: v, w: Math.round(v * aspect) });
    else update({ h: v });
  }

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.position}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={element.x} onChange={(v) => update({ x: v })} />
        <NumField label="Y" value={element.y} onChange={(v) => update({ y: v })} />
        <NumField label="W" value={element.w} onChange={updateW} />
        <NumField label="H" value={element.h} onChange={updateH} />
      </div>
      <button
        onClick={() => { update({ aspectRatioLocked: !locked }); }}
        className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] transition-colors ${
          locked ? "bg-blue-500/20 text-blue-400" : "text-neutral-500 hover:bg-neutral-800"
        }`}
      >
        {locked ? <LinkSimple size={12} /> : <LinkSimpleBreak size={12} />}
        {locked ? "Ratio locked" : "Lock ratio"}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <NumField label={t.editor.rotation} value={element.rotation} onChange={(v) => update({ rotation: v })} />
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">{t.editor.opacity} {Math.round(element.opacity * 100)}%</span>
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
      {/* Border */}
      <div className="flex gap-2">
        <label className="flex flex-col gap-0.5 flex-1">
          <span className="text-[10px] text-neutral-500">Border</span>
          <input
            type="number"
            min={0}
            max={20}
            value={element.borderWidth ?? 0}
            onChange={(e) => update({ borderWidth: parseInt(e.target.value) || 0 })}
            className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
          />
        </label>
        {(element.borderWidth ?? 0) > 0 && (
          <label className="flex flex-col gap-0.5 flex-1">
            <span className="text-[10px] text-neutral-500">Color</span>
            <input
              type="color"
              value={element.borderColor ?? "#000000"}
              onChange={(e) => update({ borderColor: e.target.value })}
              className="h-7 w-full rounded border border-neutral-700 bg-[#161616] cursor-pointer"
            />
          </label>
        )}
      </div>
      {/* Link URL */}
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">Link URL</span>
        <input
          type="url"
          value={element.linkUrl ?? ""}
          onChange={(e) => updateElement(element.id, { linkUrl: e.target.value || undefined })}
          onBlur={pushHistory}
          placeholder="https://..."
          className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none placeholder:text-neutral-700 focus:border-neutral-500"
        />
      </label>
    </div>
  );
}
