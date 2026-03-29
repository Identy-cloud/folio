"use client";

import { DialogShell } from "@/components/ui/DialogShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

const isMac = typeof navigator !== "undefined" && navigator.platform.startsWith("Mac");
const mod = isMac ? "⌘" : "Ctrl";

const GROUPS = [
  {
    title: "General",
    shortcuts: [
      { keys: `${mod} + Z`, label: "Undo" },
      { keys: `${mod} + Shift + Z`, label: "Redo" },
      { keys: `${mod} + C`, label: "Copy" },
      { keys: `${mod} + V`, label: "Paste" },
      { keys: `${mod} + D`, label: "Duplicate" },
      { keys: "Escape", label: "Deselect" },
      { keys: "?", label: "Shortcuts" },
    ],
  },
  {
    title: "Elements",
    shortcuts: [
      { keys: "Delete / ⌫", label: "Delete element" },
      { keys: "← → ↑ ↓", label: "Move 1px" },
      { keys: "Shift + arrows", label: "Move 10px" },
    ],
  },
  {
    title: "Viewer",
    shortcuts: [
      { keys: "→ / Space", label: "Next slide" },
      { keys: "←", label: "Previous slide" },
      { keys: "F", label: "Fullscreen" },
      { keys: "Escape", label: "Exit fullscreen" },
    ],
  },
];

export function ShortcutsPanel({ open, onClose }: Props) {
  return (
    <DialogShell
      open={open}
      ariaLabel="Keyboard shortcuts"
      onClose={onClose}
      className="w-full max-w-md rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-neutral-200">
        KEYBOARD SHORTCUTS
      </h3>
      <div className="mt-4 space-y-5">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.shortcuts.map((s) => (
                <div key={s.keys} className="flex items-center justify-between py-1">
                  <span className="text-xs text-neutral-400">{s.label}</span>
                  <kbd className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-5 w-full rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
      >
        Close
      </button>
    </DialogShell>
  );
}
