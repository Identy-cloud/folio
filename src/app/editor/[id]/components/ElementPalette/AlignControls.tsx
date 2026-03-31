"use client";

import { useEditorStore } from "@/store/editorStore";
import { AlignLeft, AlignCenterHorizontalSimple, AlignRight, AlignTop, AlignCenterVerticalSimple, AlignBottom } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { Tooltip } from "@/components/ui/Tooltip";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 430;
const MOBILE_H = 932;

export function AlignControls({ elementId }: { elementId: string }) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const slide = useEditorStore((s) => s.getActiveSlide());
  const editingMode = useEditorStore((s) => s.editingMode);

  const isMobile = editingMode === "mobile";
  const CANVAS_W = isMobile ? MOBILE_W : DESKTOP_W;
  const CANVAS_H = isMobile ? MOBILE_H : DESKTOP_H;

  const elements = isMobile && slide?.mobileElements ? slide.mobileElements : slide?.elements;
  const el = elements?.find((e) => e.id === elementId);
  if (!el) return null;

  function align(pos: Partial<{ x: number; y: number }>) {
    updateElement(elementId, pos);
    pushHistory();
  }

  const btn = "flex h-8 w-8 items-center justify-center rounded text-silver/70 hover:bg-white/5 hover:text-silver transition-colors";

  return (
    <div>
      <div className="flex gap-1">
        <Tooltip content="Align left">
          <button onClick={() => align({ x: 0 })} className={btn} aria-label="Align left">
            <AlignLeft size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content="Align center">
          <button onClick={() => align({ x: (CANVAS_W - el.w) / 2 })} className={btn} aria-label="Align center horizontal">
            <AlignCenterHorizontalSimple size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content="Align right">
          <button onClick={() => align({ x: CANVAS_W - el.w })} className={btn} aria-label="Align right">
            <AlignRight size={14} weight="regular" />
          </button>
        </Tooltip>
        <div className="w-px bg-steel" />
        <Tooltip content="Align top">
          <button onClick={() => align({ y: 0 })} className={btn} aria-label="Align top">
            <AlignTop size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content="Align middle">
          <button onClick={() => align({ y: (CANVAS_H - el.h) / 2 })} className={btn} aria-label="Align center vertical">
            <AlignCenterVerticalSimple size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content="Align bottom">
          <button onClick={() => align({ y: CANVAS_H - el.h })} className={btn} aria-label="Align bottom">
            <AlignBottom size={14} weight="regular" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
