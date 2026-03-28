"use client";

import { Trash } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";

export function DeleteButton({ elementId }: { elementId: string }) {
  const deleteElement = useEditorStore((s) => s.deleteElement);

  return (
    <button
      onClick={() => deleteElement(elementId)}
      className="flex w-full items-center justify-center gap-2 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400 hover:bg-red-950/50 transition-colors"
    >
      <Trash size={14} weight="duotone" />
      Eliminar elemento
    </button>
  );
}
