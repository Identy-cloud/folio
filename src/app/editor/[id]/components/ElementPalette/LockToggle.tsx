"use client";

import { Lock, LockOpen } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

export function LockToggle({ element }: { element: SlideElement }) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const isBusy = useEditorStore((s) => s.busyElementIds.has(element.id));

  function toggle() {
    updateElement(element.id, { locked: !element.locked });
    pushHistory();
  }

  return (
    <button
      onClick={toggle}
      disabled={isBusy}
      className={`flex w-full items-center justify-center gap-2 rounded border px-3 py-2 text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none ${
        element.locked
          ? "border-amber-900/50 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50"
          : "border-steel text-silver/70 hover:bg-white/5"
      }`}
    >
      {element.locked ? <Lock size={14} weight="regular" /> : <LockOpen size={14} weight="regular" />}
      {element.locked ? t.editor.unlock : t.editor.lock}
    </button>
  );
}
