"use client";

import { useEditorStore } from "@/store/editorStore";
import { ArrowFatUp, ArrowFatDown, ArrowFatLineUp, ArrowFatLineDown } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { Tooltip } from "@/components/ui/Tooltip";

export function LayerControls({ elementId }: { elementId: string }) {
  const { t } = useTranslation();
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const isBusy = useEditorStore((s) => s.busyElementIds.has(elementId));

  const btn = `flex h-8 w-8 items-center justify-center rounded text-silver/70 hover:bg-white/5 hover:text-silver transition-colors ${isBusy ? "opacity-40 pointer-events-none" : ""}`;

  return (
    <div>
      <div className="flex gap-1">
        <Tooltip content={t.editor.toFront}>
          <button onClick={() => bringToFront(elementId)} className={btn}>
            <ArrowFatLineUp size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content={t.editor.forward}>
          <button onClick={() => bringForward(elementId)} className={btn}>
            <ArrowFatUp size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content={t.editor.backward}>
          <button onClick={() => sendBackward(elementId)} className={btn}>
            <ArrowFatDown size={14} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip content={t.editor.toBack}>
          <button onClick={() => sendToBack(elementId)} className={btn}>
            <ArrowFatLineDown size={14} weight="regular" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
