"use client";

import { useState, useEffect } from "react";
import { SlidePanel } from "./SlidePanel/SlidePanel";
import { Canvas } from "./Canvas/Canvas";
import { Toolbar } from "./Toolbar/Toolbar";
import { ElementPalette } from "./ElementPalette/ElementPalette";
import { Onboarding } from "@/components/editor/Onboarding";
import { OfflineBanner } from "@/components/editor/OfflineBanner";
import { useKeyboard } from "../hooks/useKeyboard";
import { useAutoSave } from "../hooks/useAutoSave";
import { useCollaboration } from "../hooks/useCollaboration";
import { useEditorStore } from "@/store/editorStore";
import { useSessionGuard } from "@/hooks/useSessionGuard";
import {
  StackSimple, PlusCircle, SlidersHorizontal,
  ArrowCounterClockwise, ArrowClockwise, Question,
} from "@phosphor-icons/react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ShortcutsPanel } from "@/components/editor/ShortcutsPanel";
import { HistoryPanel } from "./HistoryPanel";
import { VersionHistory } from "./VersionHistory";
import { LayerPanel } from "./LayerPanel";
import { SlideNotes } from "./SlideNotes";
import { FindReplace } from "./FindReplace";
import { SlideSorter } from "./SlideSorter";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { EditorComments } from "./EditorComments";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
import { CommandPalette } from "./CommandPalette";
import { UnsplashPicker } from "./UnsplashPicker";
import { LayoutPicker } from "./LayoutPicker";
import { ClockCounterClockwise, Stack, NotePencil } from "@phosphor-icons/react";
import { MobileSlidePanel } from "./Mobile/MobileSlidePanel";
import { MobileInsertPanel } from "./Mobile/MobileInsertPanel";
import { MobilePropertiesPanel } from "./Mobile/MobilePropertiesPanel";
import { useTranslation } from "@/lib/i18n/context";

export function EditorLayout() {
  const { t } = useTranslation();
  const presentationId = useEditorStore((s) => s.presentationId);
  const { peers, connected, updateCursor, clearCursor } =
    useCollaboration(presentationId);

  useKeyboard();
  useAutoSave();
  useSessionGuard();

  const [mobilePanel, setMobilePanel] = useState<"slides" | "insert" | "properties" | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findShowReplace, setFindShowReplace] = useState(false);
  const [sorterOpen, setSorterOpen] = useState(false);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const rightPanel = versionsOpen ? "versions" : historyOpen ? "history" : layersOpen ? "layers" : "palette";
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const hasSelection = selectedIds.length > 0;

  useEffect(() => {
    const onOpenUnsplash = () => setUnsplashOpen(true);
    window.addEventListener("folio:open-unsplash", onOpenUnsplash);
    return () => window.removeEventListener("folio:open-unsplash", onOpenUnsplash);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setFindShowReplace(false);
        setFindOpen(true);
        return;
      }
      if (e.key === "h" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setFindShowReplace(true);
        setFindOpen(true);
        return;
      }
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
      if (e.key === "/" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "F2") {
        e.preventDefault();
        setSorterOpen((v) => !v);
      }
      if (e.key === "F11") {
        e.preventDefault();
        setCompact((v) => !v);
      }
      if (e.key === "F5") {
        e.preventDefault();
        window.open(`/preview/${presentationId}`, "_blank");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-[#111111]">
      <OfflineBanner />
      <div data-panel="toolbar">
        <Toolbar
          connected={connected}
          peerCount={peers.length}
          onToggleHistory={() => { setHistoryOpen((v) => !v); setLayersOpen(false); setVersionsOpen(false); }}
          historyOpen={historyOpen}
          onToggleVersions={() => { setVersionsOpen((v) => !v); setHistoryOpen(false); setLayersOpen(false); }}
          versionsOpen={versionsOpen}
          onToggleLayers={() => { setLayersOpen((v) => !v); setHistoryOpen(false); setVersionsOpen(false); }}
          layersOpen={layersOpen}
          onToggleNotes={() => setNotesOpen((v) => !v)}
          notesOpen={notesOpen}
          onToggleSorter={() => setSorterOpen((v) => !v)}
          onToggleThemeCustomizer={() => setThemeCustomizerOpen((v) => !v)}
          onToggleComments={() => setCommentsOpen((v) => !v)}
          onToggleCollaborators={() => setCollaboratorsOpen((v) => !v)}
          collaboratorsOpen={collaboratorsOpen}
          onToggleLayoutPicker={() => setLayoutPickerOpen((v) => !v)}
        />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div data-panel="slides" className={`hidden h-full md:block ${compact ? "md:hidden" : ""}`}>
          <SlidePanel />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <Canvas
              peers={peers}
              onCursorMove={updateCursor}
              onCursorLeave={clearCursor}
            />
          </div>
          {notesOpen && <SlideNotes />}
        </div>

        <div data-panel="palette" className={`hidden h-full md:block ${compact ? "md:hidden" : ""}`}>
          {rightPanel === "versions" ? (
            <div className="flex h-full w-56 flex-col border-l border-neutral-800 bg-[#161616]">
              <VersionHistory onClose={() => setVersionsOpen(false)} />
            </div>
          ) : rightPanel === "history" ? (
            <div className="flex h-full w-56 flex-col border-l border-neutral-800 bg-[#161616]">
              <HistoryPanel onClose={() => setHistoryOpen(false)} />
            </div>
          ) : rightPanel === "layers" ? (
            <div className="flex h-full w-56 flex-col border-l border-neutral-800 bg-[#161616]">
              <LayerPanel onClose={() => setLayersOpen(false)} />
            </div>
          ) : (
            <ElementPalette />
          )}
        </div>
      </div>

      {/* Mobile undo/redo */}
      <div className="fixed top-14 right-2 z-40 flex gap-1 md:hidden">
        <button
          onClick={() => useEditorStore.getState().undo()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
          aria-label={t.editor.undo}
        >
          <ArrowCounterClockwise size={16} />
        </button>
        <button
          onClick={() => useEditorStore.getState().redo()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
          aria-label={t.editor.redo}
        >
          <ArrowClockwise size={16} />
        </button>
      </div>

      {/* Mobile floating buttons */}
      <div className="fixed bottom-4 left-4 z-40 flex gap-2 md:hidden">
        <button
          onClick={() => setMobilePanel(mobilePanel === "slides" ? null : "slides")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg active:scale-95 transition-transform"
          aria-label={t.editor.slides}
        >
          <StackSimple size={20} weight="regular" />
        </button>
        <button
          onClick={() => setMobilePanel(mobilePanel === "insert" ? null : "insert")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg active:scale-95 transition-transform"
          aria-label={t.editor.insertElement}
        >
          <PlusCircle size={20} weight="regular" />
        </button>
        {hasSelection && (
          <button
            onClick={() => setMobilePanel(mobilePanel === "properties" ? null : "properties")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:scale-95 transition-transform animate-[props-in_0.2s_ease-out]"
            aria-label={t.editor.properties}
          >
            <SlidersHorizontal size={20} weight="regular" />
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      <BottomSheet
        open={mobilePanel !== null}
        title={mobilePanel === "slides" ? t.editor.slides : mobilePanel === "properties" ? t.editor.properties : t.editor.insert}
        onClose={() => setMobilePanel(null)}
      >
        {mobilePanel === "slides" && (
          <MobileSlidePanel onClose={() => setMobilePanel(null)} />
        )}
        {mobilePanel === "insert" && (
          <MobileInsertPanel onClose={() => setMobilePanel(null)} />
        )}
        {mobilePanel === "properties" && (
          <MobilePropertiesPanel onClose={() => setMobilePanel(null)} />
        )}
      </BottomSheet>

      {/* Help button – bottom-right */}
      <button
        onClick={() => setShortcutsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 shadow-lg backdrop-blur-sm transition-colors"
        aria-label="Keyboard shortcuts"
      >
        <Question size={16} weight="bold" />
      </button>

      <FindReplace open={findOpen} onClose={() => setFindOpen(false)} showReplace={findShowReplace} />
      <SlideSorter open={sorterOpen} onClose={() => setSorterOpen(false)} />
      <ThemeCustomizer open={themeCustomizerOpen} onClose={() => setThemeCustomizerOpen(false)} />
      <EditorComments open={commentsOpen} onClose={() => setCommentsOpen(false)} />
      <CollaboratorsPanel open={collaboratorsOpen} onClose={() => setCollaboratorsOpen(false)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <LayoutPicker open={layoutPickerOpen} onClose={() => setLayoutPickerOpen(false)} />
      {unsplashOpen && <UnsplashPicker onClose={() => setUnsplashOpen(false)} />}
      <Onboarding />
      <ShortcutsPanel open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

