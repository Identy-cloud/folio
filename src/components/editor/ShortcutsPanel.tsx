"use client";

import { useState, useMemo } from "react";
import { DialogShell } from "@/components/ui/DialogShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const mod = isMac ? "⌘" : "Ctrl";

const GROUPS: { title: string; items: { keys: string; label: string }[] }[] = [
  {
    title: "General",
    items: [
      { keys: `${mod}+Z`, label: "Undo" },
      { keys: `${mod}+⇧+Z`, label: "Redo" },
      { keys: `${mod}+A`, label: "Select all" },
      { keys: "Esc", label: "Deselect / reset tool" },
      { keys: "?", label: "Toggle shortcuts panel" },
      { keys: "/", label: "Command palette" },
    ],
  },
  {
    title: "Elements",
    items: [
      { keys: `${mod}+C`, label: "Copy" },
      { keys: `${mod}+V`, label: "Paste" },
      { keys: `${mod}+D`, label: "Duplicate" },
      { keys: "Del / ⌫", label: "Delete" },
      { keys: "← → ↑ ↓", label: "Move 1 px" },
      { keys: "⇧+Arrow", label: "Move 10 px" },
      { keys: "Alt+Arrow", label: "Resize" },
      { keys: "1–9 / 0", label: "Opacity 10%–90% / 100%" },
      { keys: "Tab / ⇧+Tab", label: "Cycle elements" },
      { keys: `${mod}+Alt+C`, label: "Copy style" },
      { keys: `${mod}+Alt+V`, label: "Paste style" },
      { keys: "⇧+H", label: "Flip horizontal (image)" },
      { keys: "⇧+V", label: "Flip vertical (image)" },
      { keys: "Alt+drag", label: "Clone element" },
    ],
  },
  {
    title: "Layers & Groups",
    items: [
      { keys: `${mod}+G`, label: "Group" },
      { keys: `${mod}+⇧+G`, label: "Ungroup" },
      { keys: `${mod}+]`, label: "Bring forward" },
      { keys: `${mod}+[`, label: "Send backward" },
      { keys: `${mod}+⇧+]`, label: "Bring to front" },
      { keys: `${mod}+⇧+[`, label: "Send to back" },
      { keys: `${mod}+⇧+M`, label: "Center on canvas" },
    ],
  },
  {
    title: "Canvas & Zoom",
    items: [
      { keys: `${mod}+scroll`, label: "Zoom in / out" },
      { keys: `${mod}+0`, label: "Reset zoom to fit" },
      { keys: "Space+drag", label: "Pan canvas" },
      { keys: "Double-click", label: "Add text element" },
    ],
  },
  {
    title: "Slides",
    items: [
      { keys: `${mod}+Enter`, label: "New slide" },
      { keys: `${mod}+⇧+D`, label: "Duplicate slide" },
      { keys: "PgUp / PgDn", label: "Previous / next slide" },
      { keys: `${mod}+↑ / ↓`, label: "Reorder slide" },
      { keys: "F2", label: "Slide sorter" },
    ],
  },
  {
    title: "View & Tools",
    items: [
      { keys: `${mod}+F`, label: "Find" },
      { keys: `${mod}+H`, label: "Find & replace" },
      { keys: "F5", label: "Start presentation" },
      { keys: "F11", label: "Compact mode" },
    ],
  },
];

export function ShortcutsPanel({ open, onClose }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (s) => s.label.toLowerCase().includes(q) || s.keys.toLowerCase().includes(q),
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <DialogShell
      open={open}
      ariaLabel="Keyboard shortcuts"
      onClose={onClose}
      className="fixed inset-0 flex flex-col bg-[#1e1e1e] md:static md:inset-auto md:w-full md:max-w-lg md:max-h-[80vh] md:rounded md:border md:border-neutral-700 md:shadow-xl md:mx-4"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-display text-sm tracking-tight text-neutral-200 uppercase">
          Keyboard Shortcuts
        </h3>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 text-xs">
          Esc
        </button>
      </div>
      <div className="px-5 pb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shortcuts..."
          autoFocus
          className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-neutral-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
        {filtered.length === 0 && (
          <p className="text-xs text-neutral-500 py-4 text-center">No matching shortcuts</p>
        )}
        {filtered.map((g) => (
          <div key={g.title}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              {g.title}
            </p>
            <div className="space-y-0.5">
              {g.items.map((s) => (
                <div key={s.keys} className="flex items-center justify-between py-1">
                  <span className="text-xs text-neutral-400">{s.label}</span>
                  <kbd className="shrink-0 ml-4 rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DialogShell>
  );
}
