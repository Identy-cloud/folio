"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { requiredPlanFor } from "@/lib/plan-limits";
import { ClockCounterClockwise, Stack, NotePencil, ChatCircleDots } from "@phosphor-icons/react";
import { useChat } from "../hooks/useChat";
import { MobileSlidePanel } from "./Mobile/MobileSlidePanel";
import { MobileInsertPanel } from "./Mobile/MobileInsertPanel";
import { MobilePropertiesPanel } from "./Mobile/MobilePropertiesPanel";
import { useTranslation } from "@/lib/i18n/context";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });
const UnsplashPicker = dynamic(() => import("./UnsplashPicker").then((m) => m.UnsplashPicker), { ssr: false });
const ThemeCustomizer = dynamic(() => import("./ThemeCustomizer").then((m) => m.ThemeCustomizer), { ssr: false });
const FindReplace = dynamic(() => import("./FindReplace").then((m) => m.FindReplace), { ssr: false });
const SlideSorter = dynamic(() => import("./SlideSorter").then((m) => m.SlideSorter), { ssr: false });
const EditorComments = dynamic(() => import("./EditorComments").then((m) => m.EditorComments), { ssr: false });
const CollaboratorsPanel = dynamic(() => import("./CollaboratorsPanel").then((m) => m.CollaboratorsPanel), { ssr: false });
const LayoutPicker = dynamic(() => import("./LayoutPicker").then((m) => m.LayoutPicker), { ssr: false });
const AnimationTimeline = dynamic(() => import("./AnimationTimeline").then((m) => m.AnimationTimeline), { ssr: false });
const SlideLibrary = dynamic(() => import("./SlideLibrary").then((m) => m.SlideLibrary), { ssr: false });
const AIGenerateDialog = dynamic(() => import("@/components/editor/AIGenerateDialog").then((m) => m.AIGenerateDialog), { ssr: false });
const AIGeneratePresentationDialog = dynamic(() => import("@/components/editor/AIGeneratePresentationDialog").then((m) => m.AIGeneratePresentationDialog), { ssr: false });
const TranslateDialog = dynamic(() => import("@/components/editor/TranslateDialog").then((m) => m.TranslateDialog), { ssr: false });
const AIImageDialog = dynamic(() => import("@/components/editor/AIImageDialog").then((m) => m.AIImageDialog), { ssr: false });
const ImportSlideModal = dynamic(() => import("./ImportSlideModal").then((m) => m.ImportSlideModal), { ssr: false });
const UpgradeModal = dynamic(() => import("@/components/UpgradeModal").then((m) => m.UpgradeModal), { ssr: false });
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function EditorLayout() {
  const { t } = useTranslation();
  const presentationId = useEditorStore((s) => s.presentationId);
  const { peers, connected, updateCursor, clearCursor, ydocRef, providerRef } =
    useCollaboration(presentationId);

  useKeyboard();
  useAutoSave();
  useSessionGuard();

  const { messages, sendMessage, unreadCount, markAsRead, markAsClosed } =
    useChat({ ydocRef, providerRef, presentationId });
  const [chatOpen, setChatOpen] = useState(false);

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
  const [aiGenerateOpen, setAIGenerateOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);
  const [aiPresentationOpen, setAIPresentationOpen] = useState(false);
  const [aiImageOpen, setAIImageOpen] = useState(false);
  const [slideLibraryOpen, setSlideLibraryOpen] = useState(false);
  const [importSlideOpen, setImportSlideOpen] = useState(false);
  const { limits } = usePlanLimits();
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);
  const rightPanel = versionsOpen ? "versions" : historyOpen ? "history" : layersOpen ? "layers" : "palette";
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const hasSelection = selectedIds.length > 0;

  useEffect(() => {
    const onOpenUnsplash = () => setUnsplashOpen(true);
    const onOpenAIGenerate = () => {
      if (!limits.canUseAI) { setUpgradeFeature("AI Slide Generation"); return; }
      setAIGenerateOpen(true);
    };
    const onOpenTranslate = () => {
      if (!limits.canUseAI) { setUpgradeFeature("AI Translate"); return; }
      setTranslateOpen(true);
    };
    const onOpenAIPresentation = () => {
      if (!limits.canUseAI) { setUpgradeFeature("AI Presentation Generator"); return; }
      setAIPresentationOpen(true);
    };
    const onOpenAIImage = () => {
      if (!limits.canUseAI) { setUpgradeFeature("AI Image Generation"); return; }
      setAIImageOpen(true);
    };
    const onOpenSlideLibrary = () => setSlideLibraryOpen(true);
    const onOpenImportSlide = () => setImportSlideOpen(true);
    window.addEventListener("folio:open-unsplash", onOpenUnsplash);
    window.addEventListener("folio:open-ai-generate", onOpenAIGenerate);
    window.addEventListener("folio:open-translate", onOpenTranslate);
    window.addEventListener("folio:open-ai-presentation", onOpenAIPresentation);
    window.addEventListener("folio:open-ai-image", onOpenAIImage);
    window.addEventListener("folio:open-slide-library", onOpenSlideLibrary);
    window.addEventListener("folio:open-import-slide", onOpenImportSlide);
    return () => {
      window.removeEventListener("folio:open-unsplash", onOpenUnsplash);
      window.removeEventListener("folio:open-ai-generate", onOpenAIGenerate);
      window.removeEventListener("folio:open-translate", onOpenTranslate);
      window.removeEventListener("folio:open-ai-presentation", onOpenAIPresentation);
      window.removeEventListener("folio:open-ai-image", onOpenAIImage);
      window.removeEventListener("folio:open-slide-library", onOpenSlideLibrary);
      window.removeEventListener("folio:open-import-slide", onOpenImportSlide);
    };
  }, [limits.canUseAI]);

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
      if (e.key === "A" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setTimelineOpen((v) => !v);
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
    <div className="flex h-screen flex-col bg-navy">
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
          {timelineOpen && <AnimationTimeline onClose={() => setTimelineOpen(false)} />}
        </div>

        <div data-panel="palette" className={`hidden h-full md:block ${compact ? "md:hidden" : ""}`}>
          {rightPanel === "versions" ? (
            <div className="flex h-full w-56 flex-col border-l border-steel/30 bg-navy">
              <VersionHistory onClose={() => setVersionsOpen(false)} />
            </div>
          ) : rightPanel === "history" ? (
            <div className="flex h-full w-56 flex-col border-l border-steel/30 bg-navy">
              <HistoryPanel onClose={() => setHistoryOpen(false)} />
            </div>
          ) : rightPanel === "layers" ? (
            <div className="flex h-full w-56 flex-col border-l border-steel/30 bg-navy">
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/80 text-silver/70 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
          aria-label={t.editor.undo}
        >
          <ArrowCounterClockwise size={16} />
        </button>
        <button
          onClick={() => useEditorStore.getState().redo()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/80 text-silver/70 shadow active:scale-95 active:text-white transition-transform backdrop-blur-sm"
          aria-label={t.editor.redo}
        >
          <ArrowClockwise size={16} />
        </button>
      </div>

      {/* Mobile floating buttons */}
      <div className="fixed bottom-4 left-4 z-40 flex gap-2 md:hidden">
        <button
          onClick={() => setMobilePanel(mobilePanel === "slides" ? null : "slides")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg active:scale-95 transition-transform"
          aria-label={t.editor.slides}
        >
          <StackSimple size={20} weight="regular" />
        </button>
        <button
          onClick={() => setMobilePanel(mobilePanel === "insert" ? null : "insert")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg active:scale-95 transition-transform"
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

      {/* Chat toggle – only when collaboration active */}
      {connected && peers.length > 0 && (
        <button
          onClick={() => {
            const next = !chatOpen;
            setChatOpen(next);
            if (next) markAsRead();
            else markAsClosed();
          }}
          className="fixed bottom-14 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/5/90 text-silver/70 hover:text-white hover:bg-steel shadow-lg backdrop-blur-sm transition-colors md:bottom-14"
          aria-label="Toggle chat"
        >
          <ChatCircleDots size={20} weight="bold" />
          {unreadCount > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      <ChatPanel
        open={chatOpen}
        onClose={() => { setChatOpen(false); markAsClosed(); }}
        messages={messages}
        onSend={sendMessage}
      />

      {/* Help button – bottom-right */}
      <button
        data-onboarding="help"
        onClick={() => setShortcutsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-silver/70 hover:text-white hover:bg-steel shadow-lg backdrop-blur-sm transition-colors"
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
      <AIGenerateDialog open={aiGenerateOpen} onClose={() => setAIGenerateOpen(false)} />
      <AIGeneratePresentationDialog open={aiPresentationOpen} onClose={() => setAIPresentationOpen(false)} />
      <TranslateDialog open={translateOpen} onClose={() => setTranslateOpen(false)} />
      <AIImageDialog open={aiImageOpen} onClose={() => setAIImageOpen(false)} />
      <SlideLibrary open={slideLibraryOpen} onClose={() => setSlideLibraryOpen(false)} />
      <ImportSlideModal open={importSlideOpen} onClose={() => setImportSlideOpen(false)} />
      <UpgradeModal
        open={upgradeFeature !== null}
        onClose={() => setUpgradeFeature(null)}
        feature={upgradeFeature ?? ""}
        requiredPlan={requiredPlanFor("canUseAI")}
      />
      <Onboarding />
      <ShortcutsPanel
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        onRestartTour={() => window.dispatchEvent(new Event("folio:restart-onboarding"))}
      />
    </div>
  );
}

