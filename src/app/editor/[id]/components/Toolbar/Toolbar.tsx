"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowClockwise, Cursor, TextT, Shapes, FilePdf, Image as ImageIcon, Desktop, DeviceMobile } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { ActiveTool } from "@/store/editorStore";
import { exportToPdf } from "@/lib/export-pdf";
import Link from "next/link";
import { ShareButton } from "./ShareButton";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useTranslation } from "@/lib/i18n/context";

interface ToolbarProps {
  connected?: boolean;
  peerCount?: number;
}

export function Toolbar({ connected, peerCount = 0 }: ToolbarProps) {
  const { t } = useTranslation();
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const slides = useEditorStore((s) => s.slides);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);

  const editingMode = useEditorStore((s) => s.editingMode);
  const setEditingMode = useEditorStore((s) => s.setEditingMode);
  const { trigger: triggerUpload, uploading } = useImageUpload();
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  const TOOLS: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: "select", label: t.editor.tools.select, icon: <Cursor size={14} weight="duotone" /> },
    { id: "text", label: t.editor.tools.text, icon: <TextT size={14} weight="duotone" /> },
    { id: "shape", label: t.editor.tools.shape, icon: <Shapes size={14} weight="duotone" /> },
  ];

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
        setExportProgress(`${current}/${total}`);
      },
    });

    setActiveSlide(currentIndex);
    setExporting(false);
    setExportProgress("");
  }

  const statusText: Record<string, string> = {
    saved: t.editor.saved, saving: t.editor.saving,
    error: t.editor.saveError, unsaved: t.editor.unsaved,
  };
  const statusColor: Record<string, string> = {
    saved: "text-green-500", saving: "text-amber-500",
    error: "text-red-600", unsaved: "text-neutral-500",
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-800 bg-[#161616] px-2 md:px-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/dashboard"
          className="font-display text-lg tracking-tight text-neutral-200 hover:text-white"
        >
          FOLIO
        </Link>
        <div className="h-5 w-px bg-neutral-700" />
        <div className="flex gap-1">
          <button onClick={undo} className="rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200" title={`${t.editor.undo} (Ctrl+Z)`} aria-label={t.editor.undo}><ArrowCounterClockwise size={16} weight="duotone" /></button>
          <button onClick={redo} className="rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200" title={`${t.editor.redo} (Ctrl+Y)`} aria-label={t.editor.redo}><ArrowClockwise size={16} weight="duotone" /></button>
        </div>
        <div className="hidden md:block h-5 w-px bg-neutral-700" />
        <div className="hidden md:flex gap-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center rounded px-3 py-1 text-xs transition-colors ${
                activeTool === tool.id
                  ? "bg-white text-[#161616]"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              {tool.icon}
              <span className="ml-1">{tool.label}</span>
            </button>
          ))}
        </div>
        <div className="hidden md:block h-5 w-px bg-neutral-700" />
        <button
          onClick={triggerUpload}
          disabled={uploading}
          className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
        >
          <ImageIcon size={14} weight="duotone" />
          {uploading ? "..." : t.editor.image}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
        >
          <FilePdf size={14} weight="duotone" />
          {exporting ? exportProgress : t.editor.pdf}
        </button>
        <div className="hidden md:block h-5 w-px bg-neutral-700" />
        <div className="hidden md:flex gap-0.5 rounded border border-neutral-700 p-0.5" role="group" aria-label={t.editor.editMode}>
          <button
            onClick={() => setEditingMode("desktop")}
            aria-label={t.editor.modeDesktop}
            aria-pressed={editingMode === "desktop"}
            className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-xs transition-colors ${
              editingMode === "desktop" ? "bg-white text-[#161616]" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Desktop size={14} />
          </button>
          <button
            onClick={() => setEditingMode("mobile")}
            aria-label={t.editor.modeMobile}
            aria-pressed={editingMode === "mobile"}
            className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-xs transition-colors ${
              editingMode === "mobile" ? "bg-white text-[#161616]" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <DeviceMobile size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ShareButton />
        {peerCount > 0 && (
          <span className="hidden md:inline text-xs text-neutral-500">
            {peerCount} {peerCount > 1 ? t.editor.collaborators : t.editor.collaborator}
          </span>
        )}
        {connected !== undefined && (
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              connected ? "bg-green-500" : "bg-neutral-600"
            }`}
            title={connected ? "Conectado" : "Desconectado"}
          />
        )}
        <span className={`text-xs ${statusColor[saveStatus]}`} aria-live="polite">
          {statusText[saveStatus]}
        </span>
      </div>
    </div>
  );
}
