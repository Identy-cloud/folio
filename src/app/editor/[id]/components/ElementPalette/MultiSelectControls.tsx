"use client";

import { useEditorStore } from "@/store/editorStore";
import {
  AlignLeft, AlignCenterHorizontalSimple, AlignRight,
  AlignTop, AlignCenterVerticalSimple, AlignBottom,
  ArrowsHorizontal, ArrowsVertical,
} from "@phosphor-icons/react";
import { Tooltip } from "@/components/ui/Tooltip";

const btn =
  "flex h-8 w-8 items-center justify-center rounded text-silver/70 hover:bg-white/5 hover:text-silver transition-colors";

export function MultiSelectControls({ elementIds }: { elementIds: string[] }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const slide = useEditorStore((s) => s.getActiveSlide());
  const editingMode = useEditorStore((s) => s.editingMode);

  const elements = editingMode === "mobile" && slide?.mobileElements
    ? slide.mobileElements
    : slide?.elements;

  const selected = elements?.filter((e) => elementIds.includes(e.id)) ?? [];
  if (selected.length < 2) return null;

  function alignAll(getPos: (el: typeof selected[0], bounds: { minX: number; maxX: number; minY: number; maxY: number; midX: number; midY: number }) => Partial<{ x: number; y: number }>) {
    const minX = Math.min(...selected.map((e) => e.x));
    const maxX = Math.max(...selected.map((e) => e.x + e.w));
    const minY = Math.min(...selected.map((e) => e.y));
    const maxY = Math.max(...selected.map((e) => e.y + e.h));
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const bounds = { minX, maxX, minY, maxY, midX, midY };
    for (const el of selected) {
      const pos = getPos(el, bounds);
      if (Object.keys(pos).length > 0) updateElement(el.id, pos);
    }
    pushHistory();
  }

  function distributeH() {
    if (selected.length < 3) return;
    const sorted = [...selected].sort((a, b) => a.x - b.x);
    const minX = sorted[0].x;
    const maxRight = sorted[sorted.length - 1].x + sorted[sorted.length - 1].w;
    const totalW = sorted.reduce((sum, e) => sum + e.w, 0);
    const gap = (maxRight - minX - totalW) / (sorted.length - 1);
    let x = minX;
    for (const el of sorted) { updateElement(el.id, { x }); x += el.w + gap; }
    pushHistory();
  }

  function distributeV() {
    if (selected.length < 3) return;
    const sorted = [...selected].sort((a, b) => a.y - b.y);
    const minY = sorted[0].y;
    const maxBottom = sorted[sorted.length - 1].y + sorted[sorted.length - 1].h;
    const totalH = sorted.reduce((sum, e) => sum + e.h, 0);
    const gap = (maxBottom - minY - totalH) / (sorted.length - 1);
    let y = minY;
    for (const el of sorted) { updateElement(el.id, { y }); y += el.h + gap; }
    pushHistory();
  }

  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-medium text-silver/70 uppercase tracking-wider">Align</span>
      <div className="flex gap-1">
        <Tooltip content="Align left"><button onClick={() => alignAll((_el, b) => ({ x: b.minX }))} className={btn} aria-label="Align left"><AlignLeft size={14} weight="regular" /></button></Tooltip>
        <Tooltip content="Align center"><button onClick={() => alignAll((el, b) => ({ x: b.midX - el.w / 2 }))} className={btn} aria-label="Align center H"><AlignCenterHorizontalSimple size={14} weight="regular" /></button></Tooltip>
        <Tooltip content="Align right"><button onClick={() => alignAll((_el, b) => ({ x: b.maxX - _el.w }))} className={btn} aria-label="Align right"><AlignRight size={14} weight="regular" /></button></Tooltip>
        <div className="w-px bg-steel" />
        <Tooltip content="Align top"><button onClick={() => alignAll((_el, b) => ({ y: b.minY }))} className={btn} aria-label="Align top"><AlignTop size={14} weight="regular" /></button></Tooltip>
        <Tooltip content="Align middle"><button onClick={() => alignAll((el, b) => ({ y: b.midY - el.h / 2 }))} className={btn} aria-label="Align center V"><AlignCenterVerticalSimple size={14} weight="regular" /></button></Tooltip>
        <Tooltip content="Align bottom"><button onClick={() => alignAll((_el, b) => ({ y: b.maxY - _el.h }))} className={btn} aria-label="Align bottom"><AlignBottom size={14} weight="regular" /></button></Tooltip>
      </div>
      <div className="flex gap-1">
        <button onClick={() => useEditorStore.getState().groupSelection()} className="flex-1 rounded border border-steel py-1.5 text-[10px] text-silver/70 hover:bg-white/5 transition-colors">Group</button>
        <button onClick={() => useEditorStore.getState().ungroupSelection()} className="flex-1 rounded border border-steel py-1.5 text-[10px] text-silver/70 hover:bg-white/5 transition-colors">Ungroup</button>
      </div>
      {selected.length >= 3 && (
        <>
          <span className="block text-[11px] font-medium text-silver/70 uppercase tracking-wider">Distribute</span>
          <div className="flex gap-1">
            <Tooltip content="Distribute horizontal"><button onClick={distributeH} className={btn} aria-label="Distribute horizontal"><ArrowsHorizontal size={14} weight="regular" /></button></Tooltip>
            <Tooltip content="Distribute vertical"><button onClick={distributeV} className={btn} aria-label="Distribute vertical"><ArrowsVertical size={14} weight="regular" /></button></Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
