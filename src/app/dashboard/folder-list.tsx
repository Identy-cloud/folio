"use client";

import { useState, useRef } from "react";
import { Folder, FolderPlus, PencilSimple, Trash, DotsThree } from "@phosphor-icons/react";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
}

interface Props {
  folders: FolderItem[];
  activeFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  onCreate: () => void;
  onRename: (folder: FolderItem) => void;
  onDelete: (folderId: string) => void;
}

export function FolderList({
  folders,
  activeFolderId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  return (
    <>
      {/* Mobile: horizontal scrollable chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        <ChipButton
          active={activeFolderId === null}
          onClick={() => onSelect(null)}
          label="All"
        />
        {folders.map((f) => (
          <ChipButton
            key={f.id}
            active={activeFolderId === f.id}
            onClick={() => onSelect(f.id)}
            label={f.name}
          />
        ))}
        <button
          onClick={onCreate}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-steel/60 px-3 py-1.5 text-xs text-silver/70 hover:border-silver hover:text-silver transition-colors"
        >
          <FolderPlus size={14} />
          New
        </button>
      </div>

      {/* Desktop: sidebar list */}
      <div className="hidden lg:flex lg:flex-col lg:gap-0.5">
        <SidebarItem
          active={activeFolderId === null}
          label="All presentations"
          onClick={() => onSelect(null)}
        />
        {folders.map((f) => (
          <SidebarFolder
            key={f.id}
            folder={f}
            active={activeFolderId === f.id}
            onSelect={() => onSelect(f.id)}
            onRename={() => onRename(f)}
            onDelete={() => onDelete(f.id)}
          />
        ))}
        <button
          onClick={onCreate}
          className="mt-2 flex w-full items-center gap-2 rounded px-3 py-2 text-xs text-silver/50 hover:bg-white/5 hover:text-silver transition-colors"
        >
          <FolderPlus size={14} />
          New folder
        </button>
      </div>
    </>
  );
}

function ChipButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-silver text-white"
          : "border border-steel text-silver/70 hover:border-silver/50 hover:text-silver"
      }`}
    >
      <Folder size={14} weight={active ? "fill" : "regular"} />
      {label}
    </button>
  );
}

function SidebarItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-white/5 text-white"
          : "text-silver/70 hover:bg-white/5 hover:text-silver"
      }`}
    >
      <Folder size={16} weight={active ? "fill" : "regular"} />
      {label}
    </button>
  );
}

function SidebarFolder({
  folder,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  folder: FolderItem;
  active: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div className="group relative flex items-center">
      <button
        onClick={onSelect}
        className={`flex flex-1 items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-white/5 text-white"
            : "text-silver/70 hover:bg-white/5 hover:text-silver"
        }`}
      >
        <Folder size={16} weight={active ? "fill" : "regular"} />
        <span className="truncate">{folder.name}</span>
      </button>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded p-1 text-silver/40 opacity-0 group-hover:opacity-100 hover:text-silver transition-all"
        >
          <DotsThree size={16} weight="regular" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded border border-steel bg-steel py-1 shadow-lg">
            <button
              onClick={() => { setMenuOpen(false); onRename(); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-silver hover:bg-white/5"
            >
              <PencilSimple size={12} /> Rename
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete(); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-white/5"
            >
              <Trash size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
