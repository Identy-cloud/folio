"use client";

import { useEditorStore } from "@/store/editorStore";
import { CopySimple, Trash, LockSimple, LockSimpleOpen, ArrowUp, ArrowDown } from "@phosphor-icons/react";
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

  const btn = "flex h-7 w-7 items-center justify-center rounded text-neutral-300 hover:bg-white/20 hover:text-white transition-colors";

  return (
    <div
      className="pointer-events-auto absolute z-50 flex gap-0.5 rounded-lg bg-neutral-900/90 px-1 py-0.5 shadow-lg backdrop-blur-sm"
      style={{
        left: element.x + element.w / 2,
        top: element.y - 40 / scale,
        transform: `scale(${1 / scale}) translate(-50%, 0)`,
        transformOrigin: "bottom center",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button onClick={() => duplicateElement(element.id)} className={btn} title="Duplicate">
        <CopySimple size={14} />
      </button>
      <button onClick={() => bringForward(element.id)} className={btn} title="Bring forward">
        <ArrowUp size={14} />
      </button>
      <button onClick={() => sendBackward(element.id)} className={btn} title="Send backward">
        <ArrowDown size={14} />
      </button>
      <button
        onClick={() => { updateElement(element.id, { locked: !element.locked }); pushHistory(); }}
        className={btn}
        title={element.locked ? "Unlock" : "Lock"}
      >
        {element.locked ? <LockSimpleOpen size={14} /> : <LockSimple size={14} />}
      </button>
      <div className="w-px bg-neutral-700" />
      <button onClick={() => deleteElement(element.id)} className={`${btn} hover:text-red-400`} title="Delete">
        <Trash size={14} />
      </button>
    </div>
  );
}
