"use client";

import { Lock, LockOpen } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/elements";

export function LockToggle({ element }: { element: SlideElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  function toggle() {
    updateElement(element.id, { locked: !element.locked });
    pushHistory();
  }

  return (
    <button
      onClick={toggle}
      className={`flex w-full items-center justify-center gap-2 rounded border px-3 py-2 text-xs transition-colors ${
        element.locked
          ? "border-amber-900/50 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50"
          : "border-neutral-700 text-neutral-400 hover:bg-neutral-800"
      }`}
    >
      {element.locked ? <Lock size={14} weight="duotone" /> : <LockOpen size={14} weight="duotone" />}
      {element.locked ? "Desbloquear" : "Bloquear"}
    </button>
  );
}
