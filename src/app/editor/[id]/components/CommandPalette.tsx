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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const addElement = useEditorStore((s) => s.addElement);
  const addSlide = useEditorStore((s) => s.addSlide);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const themeKey = useEditorStore((s) => s.theme);
  const theme = THEMES[themeKey] ?? THEMES["editorial-blue"];
  const zBase = (activeSlide?.elements.length ?? 0) + 1;

  useEffect(() => {
    if (open) { setQuery(""); setSelectedIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
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
    { id: "center", label: "Center element on canvas", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      const slide = s.getActiveSlide();
      if (!slide) return;
      const cw = s.editingMode === "mobile" ? 430 : 1920;
      const ch = s.editingMode === "mobile" ? 932 : 1080;
      const els = s.editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;
      s.selectedElementIds.forEach((id) => {
        const el = els.find((e) => e.id === id);
        if (el) s.updateElement(id, { x: (cw - el.w) / 2, y: (ch - el.h) / 2 });
      });
      s.pushHistory();
    }},
    { id: "undo", label: "Undo", category: "Edit", action: () => useEditorStore.getState().undo() },
    { id: "redo", label: "Redo", category: "Edit", action: () => useEditorStore.getState().redo() },
    { id: "preview", label: "Preview presentation", category: "View", action: () => window.open(`/preview/${useEditorStore.getState().presentationId}`, "_blank") },
    { id: "hexagon", label: "Hexagon", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "hexagon", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "pentagon", label: "Pentagon", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "pentagon", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "triangle", label: "Triangle", category: "Shape", action: () => addElement({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "triangle", ...shapeDefaults(theme) } satisfies ShapeElement) },
    { id: "word-count", label: "Word count", category: "Info", action: () => {
      const { slides } = useEditorStore.getState();
      let words = 0, chars = 0, textEls = 0;
      slides.forEach((s) => s.elements.forEach((el) => {
        if (el.type === "text") {
          const raw = (el as { content: string }).content.replace(/<[^>]*>/g, "");
          words += raw.split(/\s+/).filter(Boolean).length;
          chars += raw.length;
          textEls++;
        }
      }));
      const minutes = Math.ceil(words / 150); // ~150 words per minute speaking
      alert(`${words} words · ${chars} chars · ${slides.length} slides\n\nEstimated presentation time: ~${minutes} min`);
    }},
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
    { id: "export-pptx", label: "Export as PPTX (PowerPoint)", category: "Export", action: () => {
      const { presentationId } = useEditorStore.getState();
      if (!presentationId) return;
      fetch(`/api/presentations/${presentationId}/export-pptx`)
        .then((res) => {
          if (!res.ok) { alert("PPTX export requires Studio or Agency plan"); return null; }
          return res.blob();
        })
        .then((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `presentation-${presentationId}.pptx`;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(() => alert("Export failed"));
    }},
    { id: "export-json", label: "Export as JSON (backup)", category: "Export", action: () => {
      const { slides, theme, presentationId } = useEditorStore.getState();
      const data = JSON.stringify({ version: 1, theme, slides }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `presentation-${presentationId}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    }},
    { id: "import-json", label: "Import from JSON", category: "Import", action: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          if (data.version === 1 && Array.isArray(data.slides)) {
            const store = useEditorStore.getState();
            useEditorStore.setState({
              slides: data.slides,
              activeSlideIndex: 0,
              selectedElementIds: [],
              dirty: true,
              saveStatus: "unsaved" as const,
            });
            store.pushHistory();
            alert(`Imported ${data.slides.length} slides`);
          } else {
            alert("Invalid file format");
          }
        } catch { alert("Failed to parse file"); }
        input.remove();
      };
      input.click();
    }},
    { id: "equal-width", label: "Make same width", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
      const first = els.find((e) => e.id === s.selectedElementIds[0]);
      if (!first) return;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { w: first.w }));
      s.pushHistory();
    }},
    { id: "equal-height", label: "Make same height", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
      const first = els.find((e) => e.id === s.selectedElementIds[0]);
      if (!first) return;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { h: first.h }));
      s.pushHistory();
    }},
    { id: "equal-size", label: "Make same size", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
      const first = els.find((e) => e.id === s.selectedElementIds[0]);
      if (!first) return;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { w: first.w, h: first.h }));
      s.pushHistory();
    }},
    { id: "reset-zoom", label: "Reset zoom & pan", category: "View", action: () => {
      window.dispatchEvent(new CustomEvent("folio:zoom-fit"));
    }},
    { id: "toggle-grid", label: "Toggle grid", category: "View", action: () => {
      window.dispatchEvent(new CustomEvent("folio:toggle-grid"));
    }},
    { id: "delete-all", label: "Delete all elements on slide", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      const slide = s.getActiveSlide();
      if (!slide || !confirm(`Delete all ${slide.elements.length} elements?`)) return;
      slide.elements.forEach((el) => s.deleteElement(el.id));
    }},
    { id: "match-x", label: "Match X position", category: "Align", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
      const first = els.find((e) => e.id === s.selectedElementIds[0]);
      if (first) { s.selectedElementIds.forEach((id) => s.updateElement(id, { x: first.x })); s.pushHistory(); }
    }},
    { id: "match-y", label: "Match Y position", category: "Align", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
      const first = els.find((e) => e.id === s.selectedElementIds[0]);
      if (first) { s.selectedElementIds.forEach((id) => s.updateElement(id, { y: first.y })); s.pushHistory(); }
    }},
    { id: "stack-v", label: "Stack vertically (equal spacing)", category: "Align", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = (s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [])
        .filter((e) => s.selectedElementIds.includes(e.id))
        .sort((a, b) => a.y - b.y);
      const gap = 20;
      let y = els[0].y;
      els.forEach((el) => { s.updateElement(el.id, { y }); y += el.h + gap; });
      s.pushHistory();
    }},
    { id: "stack-h", label: "Stack horizontally (equal spacing)", category: "Align", action: () => {
      const s = useEditorStore.getState();
      if (s.selectedElementIds.length < 2) return;
      const slide = s.getActiveSlide();
      const els = (s.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [])
        .filter((e) => s.selectedElementIds.includes(e.id))
        .sort((a, b) => a.x - b.x);
      const gap = 20;
      let x = els[0].x;
      els.forEach((el) => { s.updateElement(el.id, { x }); x += el.w + gap; });
      s.pushHistory();
    }},
    { id: "fit-width", label: "Fit to canvas width", category: "Size", action: () => {
      const s = useEditorStore.getState();
      const cw = s.editingMode === "mobile" ? 430 : 1920;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { x: 0, w: cw }));
      s.pushHistory();
    }},
    { id: "fit-height", label: "Fit to canvas height", category: "Size", action: () => {
      const s = useEditorStore.getState();
      const ch = s.editingMode === "mobile" ? 932 : 1080;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { y: 0, h: ch }));
      s.pushHistory();
    }},
    { id: "fit-canvas", label: "Fit to full canvas", category: "Size", action: () => {
      const s = useEditorStore.getState();
      const cw = s.editingMode === "mobile" ? 430 : 1920;
      const ch = s.editingMode === "mobile" ? 932 : 1080;
      s.selectedElementIds.forEach((id) => s.updateElement(id, { x: 0, y: 0, w: cw, h: ch }));
      s.pushHistory();
    }},
    { id: "reset-rotation", label: "Reset rotation to 0°", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      s.selectedElementIds.forEach((id) => s.updateElement(id, { rotation: 0 }));
      s.pushHistory();
    }},
    { id: "toggle-safe-area", label: "Toggle safe area guides", category: "View", action: () => {
      window.dispatchEvent(new CustomEvent("folio:toggle-safe-area"));
    }},
    { id: "reset-opacity", label: "Reset opacity to 100%", category: "Edit", action: () => {
      const s = useEditorStore.getState();
      s.selectedElementIds.forEach((id) => s.updateElement(id, { opacity: 1 }));
      s.pushHistory();
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
          onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
            if (e.key === "Enter" && filtered.length > 0) run(filtered[selectedIdx]);
          }}
          placeholder="Type to search commands..."
          className="w-full border-b border-neutral-700 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
        />
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => run(cmd)}
              className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors ${
                i === selectedIdx ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800"
              }`}
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
