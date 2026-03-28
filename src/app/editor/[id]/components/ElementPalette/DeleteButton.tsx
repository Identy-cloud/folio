"use client";

import { Trash } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useTranslation } from "@/lib/i18n/context";

export function DeleteButton({ elementId }: { elementId: string }) {
  const { t } = useTranslation();
  const deleteElement = useEditorStore((s) => s.deleteElement);
  const isBusy = useEditorStore((s) => s.busyElementIds.has(elementId));

  return (
    <button
      onClick={() => deleteElement(elementId)}
      disabled={isBusy}
      className="flex w-full items-center justify-center gap-2 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400 hover:bg-red-950/50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      <Trash size={14} weight="duotone" />
      {t.editor.deleteElement}
    </button>
  );
}
