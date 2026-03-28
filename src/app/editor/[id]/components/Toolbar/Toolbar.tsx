"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { ActiveTool } from "@/store/editorStore";
import { exportToPdf } from "@/lib/export-pdf";
import Link from "next/link";

const TOOLS: { id: ActiveTool; label: string }[] = [
  { id: "select", label: "Seleccionar" },
  { id: "text", label: "Texto" },
  { id: "shape", label: "Forma" },
];

interface ToolbarProps {
  connected?: boolean;
  peerCount?: number;
}

export function Toolbar({ connected, peerCount = 0 }: ToolbarProps) {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const slides = useEditorStore((s) => s.slides);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  async function handleExport() {
    setExporting(true);
    const currentIndex = useEditorStore.getState().activeSlideIndex;

    await exportToPdf({
      title: "Presentation",
      slideCount: slides.length,
      getSlideElement: (index) => {
        setActiveSlide(index);
        return document.querySelector("[data-slide-canvas]") as HTMLElement;
      },
      onProgress: (current, total) => {
        setExportProgress(`Exportando slide ${current} de ${total}...`);
      },
    });

    setActiveSlide(currentIndex);
    setExporting(false);
    setExportProgress("");
  }

  const statusText: Record<string, string> = {
    saved: "Guardado", saving: "Guardando...",
    error: "Error al guardar", unsaved: "Sin guardar",
  };
  const statusColor: Record<string, string> = {
    saved: "text-green-600", saving: "text-amber-600",
    error: "text-red-600", unsaved: "text-neutral-400",
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="font-display text-lg tracking-tight text-neutral-900 hover:text-neutral-600"
        >
          FOLIO
        </Link>
        <div className="h-5 w-px bg-neutral-200" />
        <div className="flex gap-1">
          <button onClick={undo} className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100" title="Deshacer (Ctrl+Z)">↩</button>
          <button onClick={redo} className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100" title="Rehacer (Ctrl+Y)">↪</button>
        </div>
        <div className="h-5 w-px bg-neutral-200" />
        <div className="flex gap-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`rounded px-3 py-1 text-xs transition-colors ${
                activeTool === tool.id
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-neutral-200" />
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
        >
          {exporting ? exportProgress : "Exportar PDF"}
        </button>
      </div>
      <div className="flex items-center gap-4">
        {peerCount > 0 && (
          <span className="text-xs text-neutral-400">
            {peerCount} colaborador{peerCount > 1 ? "es" : ""}
          </span>
        )}
        {connected !== undefined && (
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              connected ? "bg-green-500" : "bg-neutral-300"
            }`}
            title={connected ? "Conectado" : "Desconectado"}
          />
        )}
        <span className={`text-xs ${statusColor[saveStatus]}`}>
          {statusText[saveStatus]}
        </span>
      </div>
    </div>
  );
}
