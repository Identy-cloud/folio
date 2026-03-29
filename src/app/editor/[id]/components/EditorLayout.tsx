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
  ArrowCounterClockwise, ArrowClockwise,
} from "@phosphor-icons/react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ShortcutsPanel } from "@/components/editor/ShortcutsPanel";
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
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const hasSelection = selectedIds.length > 0;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).isContentEditable) return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-[#111111]">
      <OfflineBanner />
      <div data-panel="toolbar">
        <Toolbar connected={connected} peerCount={peers.length} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div data-panel="slides" className="hidden h-full md:block">
          <SlidePanel />
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Canvas
            peers={peers}
            onCursorMove={updateCursor}
            onCursorLeave={clearCursor}
          />
        </div>

        <div data-panel="palette" className="hidden h-full md:block">
          <ElementPalette />
        </div>
      </div>

      {/* Mobile undo/redo */}
      <div className="fixed top-14 right-2 z-40 flex gap-1 md:hidden">
        <button
          onClick={() => useEditorStore.getState().undo()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
          aria-label={t.editor.undo}
        >
          <ArrowCounterClockwise size={16} />
        </button>
        <button
          onClick={() => useEditorStore.getState().redo()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
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
          <StackSimple size={20} weight="duotone" />
        </button>
        <button
          onClick={() => setMobilePanel(mobilePanel === "insert" ? null : "insert")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg active:scale-95 transition-transform"
          aria-label={t.editor.insertElement}
        >
          <PlusCircle size={20} weight="duotone" />
        </button>
        {hasSelection && (
          <button
            onClick={() => setMobilePanel(mobilePanel === "properties" ? null : "properties")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:scale-95 transition-transform animate-[props-in_0.2s_ease-out]"
            aria-label={t.editor.properties}
          >
            <SlidersHorizontal size={20} weight="duotone" />
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

      <Onboarding />
      <ShortcutsPanel open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

