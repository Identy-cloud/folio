"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowCounterClockwise, ArrowClockwise, FilePdf, FileImage, Image as ImageIcon, Desktop, DeviceMobile, Play, ClockCounterClockwise, Stack, NotePencil } from "@phosphor-icons/react";
import { FolioLogo } from "@/components/FolioLogo";
import { Tooltip } from "@/components/ui/Tooltip";

function Spinner() {
  return <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />;
}
import { useEditorStore } from "@/store/editorStore";
import Link from "next/link";
import { GearSix } from "@phosphor-icons/react";
import { ShareButton } from "./ShareButton";
import { PresentationSettings } from "./PresentationSettings";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useTranslation } from "@/lib/i18n/context";
import { usePlanLimits } from "@/hooks/usePlanLimits";

interface ToolbarProps {
  connected?: boolean;
  peerCount?: number;
  onToggleHistory?: () => void;
  historyOpen?: boolean;
  onToggleLayers?: () => void;
  layersOpen?: boolean;
  onToggleNotes?: () => void;
  notesOpen?: boolean;
}

export function Toolbar({ connected, peerCount = 0, onToggleHistory, historyOpen, onToggleLayers, layersOpen, onToggleNotes, notesOpen }: ToolbarProps) {
  const { t } = useTranslation();
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.historyIndex > 0);
  const canRedo = useEditorStore((s) => s.historyIndex < s.history.length - 1);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const slides = useEditorStore((s) => s.slides);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);

  const editingMode = useEditorStore((s) => s.editingMode);
  const setEditingMode = useEditorStore((s) => s.setEditingMode);
  const { trigger: triggerUpload, uploading } = useImageUpload();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const presentationId = useEditorStore((s) => s.presentationId);

  useEffect(() => {
    if (!presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.title) setTitle(d.title); })
      .catch(() => {});
  }, [presentationId]);

  function saveTitle() {
    if (!title.trim() || !presentationId) return;
    fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    }).catch(() => {});
  }
  const { limits } = usePlanLimits();
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  async function handleExport() {
    setExporting(true);
    const currentIndex = useEditorStore.getState().activeSlideIndex;

    const { exportToPdf } = await import("@/lib/export-pdf");
    await exportToPdf({
      title: title || "Presentation",
      slideCount: slides.length,
      getSlideElement: (index) => {
        setActiveSlide(index);
        return document.querySelector("[data-slide-canvas]") as HTMLElement;
      },
      onProgress: (current, total) => {
        setExportProgress(`${current}/${total}`);
      },
      delayMs: 150,
    });

    setActiveSlide(currentIndex);
    setExporting(false);
    setExportProgress("");
  }

  async function handleExportPng() {
    const el = document.querySelector("[data-slide-canvas]") as HTMLElement;
    if (!el) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(el, { width: 1920, height: 1080, pixelRatio: 1, cacheBust: true });
    const a = document.createElement("a");
    a.href = dataUrl;
    const safeName = (title || "slide").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
    a.download = `${safeName}-${useEditorStore.getState().activeSlideIndex + 1}.png`;
    a.click();
  }

  async function handleExportAllPng() {
    setExporting(true);
    const { toPng } = await import("html-to-image");
    const currentIndex = useEditorStore.getState().activeSlideIndex;
    const safeName = (title || "presentation").replace(/[^a-zA-Z0-9-_ ]/g, "").trim();

    for (let i = 0; i < slides.length; i++) {
      setExportProgress(`${i + 1}/${slides.length}`);
      setActiveSlide(i);
      await new Promise((r) => setTimeout(r, 200));
      const el = document.querySelector("[data-slide-canvas]") as HTMLElement;
      if (!el) continue;
      const dataUrl = await toPng(el, { width: 1920, height: 1080, pixelRatio: 1, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${safeName}-${i + 1}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 100));
    }

    setActiveSlide(currentIndex);
    setExporting(false);
    setExportProgress("");
  }

  const statusDot: Record<string, string> = {
    saved: "bg-green-500",
    saving: "bg-amber-500 animate-pulse",
    error: "bg-red-500",
    unsaved: "bg-neutral-600",
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-800 bg-[#161616] px-2 md:px-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/dashboard"
          className="font-display text-xl tracking-tight text-white sm:text-2xl"
        >
          <FolioLogo size={20} />
        </Link>
        <div className="hidden sm:block h-5 w-px bg-neutral-700" />
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => { if (e.key === "Enter") { saveTitle(); titleRef.current?.blur(); } }}
          className="hidden sm:block w-28 md:w-40 truncate bg-transparent text-xs text-neutral-400 outline-none hover:text-neutral-200 focus:text-white"
          placeholder="Untitled"
        />
        <Tooltip content="Settings">
          <button
            onClick={() => setSettingsOpen(true)}
            className="hidden sm:flex rounded p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
          >
            <GearSix size={14} />
          </button>
        </Tooltip>
        <div className="h-5 w-px bg-neutral-700" />
        <div className="flex gap-1">
          <Tooltip content={t.editor.undo} shortcut="Ctrl+Z">
            <button onClick={undo} disabled={!canUndo} className="rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30 disabled:pointer-events-none" aria-label={t.editor.undo}><ArrowCounterClockwise size={16} weight="regular" /></button>
          </Tooltip>
          <Tooltip content={t.editor.redo} shortcut="Ctrl+Y">
            <button onClick={redo} disabled={!canRedo} className="rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30 disabled:pointer-events-none" aria-label={t.editor.redo}><ArrowClockwise size={16} weight="regular" /></button>
          </Tooltip>
          {onToggleHistory && (
            <Tooltip content="History">
              <button
                onClick={onToggleHistory}
                className={`hidden md:flex rounded p-2 transition-colors ${historyOpen ? "bg-neutral-700 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"}`}
                aria-label="History"
                aria-pressed={historyOpen}
              >
                <ClockCounterClockwise size={16} weight="regular" />
              </button>
            </Tooltip>
          )}
          {onToggleLayers && (
            <Tooltip content="Layers">
              <button
                onClick={onToggleLayers}
                className={`hidden md:flex rounded p-2 transition-colors ${layersOpen ? "bg-neutral-700 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"}`}
                aria-label="Layers"
                aria-pressed={layersOpen}
              >
                <Stack size={16} weight="regular" />
              </button>
            </Tooltip>
          )}
          {onToggleNotes && (
            <Tooltip content="Notes">
              <button
                onClick={onToggleNotes}
                className={`hidden md:flex rounded p-2 transition-colors ${notesOpen ? "bg-neutral-700 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"}`}
                aria-label="Slide notes"
                aria-pressed={notesOpen}
              >
                <NotePencil size={16} weight="regular" />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="hidden md:block h-5 w-px bg-neutral-700" />
        <Tooltip content={t.editor.image}>
          <button
            onClick={triggerUpload}
            disabled={uploading}
            className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
          >
            <ImageIcon size={14} weight="duotone" />
            {uploading ? <Spinner /> : t.editor.image}
          </button>
        </Tooltip>
        <Tooltip content={limits.canExportPdf ? "Export PDF" : "Upgrade to export PDF"}>
          <button
            onClick={handleExport}
            disabled={exporting || !limits.canExportPdf}
            className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
          >
            <FilePdf size={14} weight="duotone" />
            {exporting ? exportProgress : t.editor.pdf}
          </button>
        </Tooltip>
        <Tooltip content="Export current slide as PNG">
          <button
            onClick={handleExportPng}
            disabled={exporting}
            className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
          >
            <FileImage size={14} weight="duotone" />
            PNG
          </button>
        </Tooltip>
        <Tooltip content="Export all slides as PNGs">
          <button
            onClick={handleExportAllPng}
            disabled={exporting}
            className="hidden md:flex items-center gap-1 rounded px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-50"
          >
            <FileImage size={14} weight="duotone" />
            {exporting && exportProgress ? exportProgress : "All PNG"}
          </button>
        </Tooltip>
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
        <Tooltip content="Preview">
          <Link
            href={`/preview/${useEditorStore.getState().presentationId}`}
            target="_blank"
            className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-medium text-[#161616] hover:bg-neutral-200 transition-colors md:px-3"
          >
            <Play size={12} weight="fill" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
        </Tooltip>
        <ShareButton />
        {peerCount > 0 && (
          <span className="hidden md:inline text-xs text-neutral-500">
            {peerCount} {peerCount > 1 ? t.editor.collaborators : t.editor.collaborator}
          </span>
        )}
        <Tooltip content={saveStatus === "saved" ? t.editor.saved : saveStatus === "saving" ? t.editor.saving : saveStatus === "error" ? t.editor.saveError : t.editor.unsaved}>
          <span
            className={`inline-block h-2 w-2 rounded-full ${statusDot[saveStatus]}`}
            aria-live="polite"
            aria-label={saveStatus}
          />
        </Tooltip>
      </div>
      <PresentationSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
