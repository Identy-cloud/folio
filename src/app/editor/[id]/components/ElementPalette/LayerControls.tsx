"use client";

import { useEditorStore } from "@/store/editorStore";
import { ArrowFatUp, ArrowFatDown, ArrowFatLineUp, ArrowFatLineDown } from "@phosphor-icons/react";

export function LayerControls({ elementId }: { elementId: string }) {
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);

  const btn = "flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors";

  return (
    <div>
      <span className="mb-1 block text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        Capas
      </span>
      <div className="flex gap-1">
        <button onClick={() => bringToFront(elementId)} className={btn} title="Al frente">
          <ArrowFatLineUp size={14} weight="duotone" />
        </button>
        <button onClick={() => bringForward(elementId)} className={btn} title="Adelante">
          <ArrowFatUp size={14} weight="duotone" />
        </button>
        <button onClick={() => sendBackward(elementId)} className={btn} title="Atrás">
          <ArrowFatDown size={14} weight="duotone" />
        </button>
        <button onClick={() => sendToBack(elementId)} className={btn} title="Al fondo">
          <ArrowFatLineDown size={14} weight="duotone" />
        </button>
      </div>
    </div>
  );
}
