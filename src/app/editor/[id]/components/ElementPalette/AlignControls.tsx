"use client";

import { useEditorStore } from "@/store/editorStore";
import { AlignLeft, AlignCenterHorizontalSimple, AlignRight, AlignTop, AlignCenterVerticalSimple, AlignBottom } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

export function AlignControls({ elementId }: { elementId: string }) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const slide = useEditorStore((s) => s.getActiveSlide());
  const el = slide?.elements.find((e) => e.id === elementId);
  if (!el) return null;

  function align(pos: Partial<{ x: number; y: number }>) {
    updateElement(elementId, pos);
    pushHistory();
  }

  const btn = "flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors";

  return (
    <div>
      <span className="mb-1 block text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.alignCanvas}
      </span>
      <div className="flex gap-1">
        <button onClick={() => align({ x: 0 })} className={btn} aria-label="Align left">
          <AlignLeft size={14} weight="duotone" />
        </button>
        <button onClick={() => align({ x: (CANVAS_W - el.w) / 2 })} className={btn} aria-label="Align center horizontal">
          <AlignCenterHorizontalSimple size={14} weight="duotone" />
        </button>
        <button onClick={() => align({ x: CANVAS_W - el.w })} className={btn} aria-label="Align right">
          <AlignRight size={14} weight="duotone" />
        </button>
        <div className="w-px bg-neutral-700" />
        <button onClick={() => align({ y: 0 })} className={btn} aria-label="Align top">
          <AlignTop size={14} weight="duotone" />
        </button>
        <button onClick={() => align({ y: (CANVAS_H - el.h) / 2 })} className={btn} aria-label="Align center vertical">
          <AlignCenterVerticalSimple size={14} weight="duotone" />
        </button>
        <button onClick={() => align({ y: CANVAS_H - el.h })} className={btn} aria-label="Align bottom">
          <AlignBottom size={14} weight="duotone" />
        </button>
      </div>
    </div>
  );
}
