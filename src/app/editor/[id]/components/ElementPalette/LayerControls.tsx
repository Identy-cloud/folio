"use client";

import { useEditorStore } from "@/store/editorStore";
import { ArrowFatUp, ArrowFatDown, ArrowFatLineUp, ArrowFatLineDown } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

export function LayerControls({ elementId }: { elementId: string }) {
  const { t } = useTranslation();
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const isBusy = useEditorStore((s) => s.busyElementIds.has(elementId));

  const btn = `flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors ${isBusy ? "opacity-40 pointer-events-none" : ""}`;

  return (
    <div>
      <span className="mb-1 block text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.layers}
      </span>
      <div className="flex gap-1">
        <button onClick={() => bringToFront(elementId)} className={btn} title={t.editor.toFront}>
          <ArrowFatLineUp size={14} weight="duotone" />
        </button>
        <button onClick={() => bringForward(elementId)} className={btn} title={t.editor.forward}>
          <ArrowFatUp size={14} weight="duotone" />
        </button>
        <button onClick={() => sendBackward(elementId)} className={btn} title={t.editor.backward}>
          <ArrowFatDown size={14} weight="duotone" />
        </button>
        <button onClick={() => sendToBack(elementId)} className={btn} title={t.editor.toBack}>
          <ArrowFatLineDown size={14} weight="duotone" />
        </button>
      </div>
    </div>
  );
}
