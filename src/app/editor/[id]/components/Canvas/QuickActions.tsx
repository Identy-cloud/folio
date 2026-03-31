"use client";

import { useEditorStore } from "@/store/editorStore";
import { CopySimple, Trash, LockSimple, LockSimpleOpen, ArrowUp, ArrowDown } from "@phosphor-icons/react";
import { Tooltip } from "@/components/ui/Tooltip";
import type { SlideElement } from "@/types/elements";

interface Props {
  element: SlideElement;
  scale: number;
}

export function QuickActions({ element, scale }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const deleteElement = useEditorStore((s) => s.deleteElement);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const btn = "flex h-7 w-7 items-center justify-center rounded text-silver hover:bg-white/20 hover:text-white transition-colors";

  return (
    <div
      className="pointer-events-auto absolute z-50 flex gap-0.5 rounded-lg bg-navy/90 px-1 py-0.5 shadow-lg backdrop-blur-sm"
      style={{
        left: element.x + element.w / 2,
        top: element.y - 40 / scale,
        transform: `scale(${1 / scale}) translate(-50%, 0)`,
        transformOrigin: "bottom center",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Tooltip content="Duplicate" side="top">
        <button onClick={() => duplicateElement(element.id)} className={btn} aria-label="Duplicar">
          <CopySimple size={14} />
        </button>
      </Tooltip>
      <Tooltip content="Bring forward" side="top">
        <button onClick={() => bringForward(element.id)} className={btn} aria-label="Traer adelante">
          <ArrowUp size={14} />
        </button>
      </Tooltip>
      <Tooltip content="Send backward" side="top">
        <button onClick={() => sendBackward(element.id)} className={btn} aria-label="Enviar atrás">
          <ArrowDown size={14} />
        </button>
      </Tooltip>
      <Tooltip content={element.locked ? "Unlock" : "Lock"} side="top">
        <button
          onClick={() => { updateElement(element.id, { locked: !element.locked }); pushHistory(); }}
          className={btn}
          aria-label={element.locked ? "Desbloquear" : "Bloquear"}
        >
          {element.locked ? <LockSimpleOpen size={14} /> : <LockSimple size={14} />}
        </button>
      </Tooltip>
      <div className="w-px bg-steel" />
      <Tooltip content="Delete" side="top">
        <button onClick={() => deleteElement(element.id)} className={`${btn} hover:text-red-400`} aria-label="Eliminar">
          <Trash size={14} />
        </button>
      </Tooltip>
    </div>
  );
}
