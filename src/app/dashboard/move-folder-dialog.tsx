"use client";

import { Folder, X } from "@phosphor-icons/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { FolderItem } from "./folder-list";

interface Props {
  folders: FolderItem[];
  onSelect: (folderId: string | null) => void;
  onCancel: () => void;
}

export function MoveToFolderDialog({ folders, onSelect, onCancel }: Props) {
  const trapRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Mover a carpeta">
      <div
        ref={trapRef}
        className="w-full max-w-xs rounded border border-steel bg-slate p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-silver">
            Move to folder
          </h3>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="rounded p-1 text-silver/50 hover:text-silver"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelect(null)}
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-silver hover:bg-white/5"
          >
            <Folder size={16} />
            No folder
          </button>
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-silver hover:bg-white/5"
            >
              <Folder size={16} />
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
