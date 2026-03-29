"use client";

import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { textDefaults, shapeDefaults, arrowDefaults, dividerDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import type { TextElement, ShapeElement, ArrowElement, DividerElement, EmbedElement } from "@/types/elements";

interface Command {
  id: string;
  label: string;
  category: string;
  action: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addElement = useEditorStore((s) => s.addElement);
  const addSlide = useEditorStore((s) => s.addSlide);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const themeKey = useEditorStore((s) => s.theme);
  const theme = THEMES[themeKey] ?? THEMES["editorial-blue"];
  const zBase = (activeSlide?.elements.length ?? 0) + 1;

  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  if (!open) return null;

  const commands: Command[] = [
    { id: "text", label: "Text", category: "Insert", action: () => addElement({ id: nanoid(), type: "text", x: 200, y: 200, w: 400, h: 80, rotation: 0, opacity: 1, zIndex: zBase, locked: false, content: "Type here", ...textDefaults(theme) } satisfies TextElement) },
    { id: "heading", label: "Heading", category: "Insert", action: () => addElement({ id: nanoid(), type: "text", x: 100, y: 100, w: 800, h: 120, rotation: 0, opacity: 1, zIndex: zBase, locked: false, content: "HEADING", fontFamily: theme.fontDisplay, fontSize: 96, fontWeight: 400, lineHeight: 1.0, letterSpacing: 0.02, color: theme.text, textAlign: "left", verticalAlign: "top" } satisfies TextElement) },
    { id: "rect", label: "Rectangle", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "rect", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "circle", label: "Circle", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "circle", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "star", label: "Star", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "star", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "diamond", label: "Diamond", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "diamond", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "arrow", label: "Arrow", category: "Insert", action: () => addElement({ id: nanoid(), type: "arrow", x: 200, y: 400, w: 300, h: 60, rotation: 0, opacity: 1, zIndex: zBase, locked: false, direction: "right", ...arrowDefaults(theme) } satisfies ArrowElement) },
    { id: "line", label: "Line / Divider", category: "Insert", action: () => addElement({ id: nanoid(), type: "divider", x: 100, y: 500, w: 600, h: 10, rotation: 0, opacity: 1, zIndex: zBase, locked: false, ...dividerDefaults(theme) } satisfies DividerElement) },
    { id: "embed", label: "Embed (YouTube, Vimeo)", category: "Insert", action: () => { const url = prompt("Paste video URL:"); if (url) addElement({ id: nanoid(), type: "embed", x: 200, y: 200, w: 640, h: 360, rotation: 0, opacity: 1, zIndex: zBase, locked: false, url } as EmbedElement); } },
    { id: "slide", label: "New slide", category: "Slide", action: () => addSlide() },
    { id: "select-all", label: "Select all elements", category: "Edit", action: () => { const s = useEditorStore.getState().getActiveSlide(); if (s) useEditorStore.setState({ selectedElementIds: s.elements.map((e) => e.id) }); } },
    { id: "deselect", label: "Deselect all", category: "Edit", action: () => useEditorStore.setState({ selectedElementIds: [] }) },
    { id: "undo", label: "Undo", category: "Edit", action: () => useEditorStore.getState().undo() },
    { id: "redo", label: "Redo", category: "Edit", action: () => useEditorStore.getState().redo() },
    { id: "preview", label: "Preview presentation", category: "View", action: () => window.open(`/preview/${useEditorStore.getState().presentationId}`, "_blank") },
    { id: "hexagon", label: "Hexagon", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "hexagon", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "pentagon", label: "Pentagon", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "pentagon", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "triangle", label: "Triangle", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "triangle", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "export-notes", label: "Export speaker notes", category: "Export", action: () => {
      const { slides } = useEditorStore.getState();
      const text = slides.map((s, i) => `--- Slide ${i + 1} ---\n${s.notes || "(no notes)"}`).join("\n\n");
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "speaker-notes.txt";
      a.click();
      URL.revokeObjectURL(a.href);
    }},
    { id: "export-outline", label: "Export text outline", category: "Export", action: () => {
      const { slides } = useEditorStore.getState();
      const text = slides.map((s, i) => {
        const texts = s.elements.filter((e) => e.type === "text").map((e) => (e as { content: string }).content.replace(/<[^>]*>/g, "")).join("\n");
        return `--- Slide ${i + 1} ---\n${texts || "(no text)"}`;
      }).join("\n\n");
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "presentation-outline.txt";
      a.click();
      URL.revokeObjectURL(a.href);
    }},
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()))
    : commands;

  function run(cmd: Command) {
    cmd.action();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="w-full max-w-md rounded border border-neutral-700 bg-[#1e1e1e] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && filtered.length > 0) run(filtered[0]);
          }}
          placeholder="Type to search commands..."
          className="w-full border-b border-neutral-700 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
        />
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => run(cmd)}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              <span>{cmd.label}</span>
              <span className="text-[10px] text-neutral-600">{cmd.category}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-neutral-600">No matches</p>
          )}
        </div>
      </div>
    </div>
  );
}
