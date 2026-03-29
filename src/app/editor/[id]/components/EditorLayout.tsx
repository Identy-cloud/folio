"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
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
  StackSimple, PlusCircle, SlidersHorizontal, X,
  TextT, Rectangle, Circle, Triangle, Image as ImageIcon,
} from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { TextElement, ShapeElement, ImageElement, ArrowElement, DividerElement, SlideTransition } from "@/types/elements";
import { textDefaults, shapeDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import { PositionFields } from "./ElementPalette/PositionFields";
import { TextProperties } from "./ElementPalette/TextProperties";
import { ShapeProperties } from "./ElementPalette/ShapeProperties";
import { ImageProperties } from "./ElementPalette/ImageProperties";
import { ArrowProperties } from "./ElementPalette/ArrowProperties";
import { DividerProperties } from "./ElementPalette/DividerProperties";
import { LayerControls } from "./ElementPalette/LayerControls";
import { AlignControls } from "./ElementPalette/AlignControls";
import { LockToggle } from "./ElementPalette/LockToggle";
import { DeleteButton } from "./ElementPalette/DeleteButton";
import { useImageUpload } from "../hooks/useImageUpload";
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
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex h-screen flex-col bg-[#111111]">
      <OfflineBanner />
      <div data-panel="toolbar">
        <Toolbar connected={connected} peerCount={peers.length} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div data-panel="slides" className="hidden md:block">
          <SlidePanel />
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Canvas
            peers={peers}
            onCursorMove={updateCursor}
            onCursorLeave={clearCursor}
          />
        </div>

        <div data-panel="palette" className="hidden md:block">
          <ElementPalette />
        </div>
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
      {mobilePanel && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobilePanel(null)}
          />
          <div role="dialog" aria-modal="true" className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-xl bg-[#1e1e1e] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-neutral-700 bg-[#1e1e1e] px-4 py-3 rounded-t-xl">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {mobilePanel === "slides" ? t.editor.slides : mobilePanel === "properties" ? t.editor.properties : t.editor.insert}
              </span>
              <button
                onClick={() => setMobilePanel(null)}
                autoFocus
                className="p-2 text-neutral-300 hover:text-white"
                aria-label={t.common.close}
              >
                <X size={18} />
              </button>
            </div>
            {mobilePanel === "slides" && (
              <MobileSlidePanel onClose={() => setMobilePanel(null)} />
            )}
            {mobilePanel === "insert" && (
              <MobileInsertPanel onClose={() => setMobilePanel(null)} />
            )}
            {mobilePanel === "properties" && (
              <MobilePropertiesPanel onClose={() => setMobilePanel(null)} />
            )}
          </div>
        </div>
      )}

      <Onboarding />
    </div>
  );
}

const MOBILE_TR_ICONS: Record<string, string> = {
  none: "—", fade: "◐", "slide-left": "→", "slide-up": "↑", zoom: "⊕",
};
const MOBILE_TR_ORDER: SlideTransition[] = ["none", "fade", "slide-left", "slide-up", "zoom"];

function MobileSlidePanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);
  const updateSlideTransition = useEditorStore((s) => s.updateSlideTransition);
  const [expandedTr, setExpandedTr] = useState<number | null>(null);

  return (
    <div className="p-4 space-y-2">
      {slides.map((slide, i) => (
        <div key={slide.id}>
          <div
            className={`relative overflow-hidden rounded border-2 transition-colors ${
              i === activeSlideIndex ? "border-blue-500" : "border-neutral-700"
            }`}
          >
            <button
              onClick={() => { setActiveSlide(i); onClose(); }}
              className="w-full"
            >
              <SlidePreview slide={slide} className="w-full" />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[9px] text-white">
              {i + 1}
            </span>
            {slides.length > 1 && (
              <button
                onClick={() => deleteSlide(slide.id)}
                aria-label={t.editor.deleteSlide}
                className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-xs text-white active:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
          {i < slides.length - 1 && (
            <div className="flex items-center justify-center py-1.5">
              {expandedTr === i ? (
                <div className="flex gap-1 rounded-full bg-neutral-800 px-2 py-1">
                  {MOBILE_TR_ORDER.map((tr) => (
                    <button
                      key={tr}
                      onClick={() => { updateSlideTransition(slides[i + 1].id, tr); setExpandedTr(null); }}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                        slides[i + 1].transition === tr
                          ? "bg-white text-[#161616]"
                          : "text-neutral-400 active:bg-neutral-700"
                      }`}
                    >
                      {MOBILE_TR_ICONS[tr]}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setExpandedTr(i)}
                  className="flex h-7 items-center gap-1.5 rounded-full bg-neutral-800/50 px-3 text-[10px] text-neutral-500 active:bg-neutral-700"
                >
                  <span>{MOBILE_TR_ICONS[slides[i + 1].transition] ?? "◐"}</span>
                  <span className="text-[9px] uppercase tracking-wider">{slides[i + 1].transition}</span>
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() => { addSlide(); onClose(); }}
        className="w-full rounded border border-dashed border-neutral-600 py-2 text-xs text-neutral-400"
      >
        {t.editor.addSlideAction}
      </button>
    </div>
  );
}

function MobileInsertPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const theme = useEditorStore((s) => THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const { trigger: triggerUpload, uploading } = useImageUpload();

  function addText() {
    const el: TextElement = {
      id: nanoid(), type: "text",
      x: 100, y: 100, w: 400, h: 80,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, content: t.editor.writeHere,
      ...textDefaults(theme),
    };
    addElement(el);
    onClose();
  }

  function addShape(shape: "rect" | "circle" | "triangle") {
    const el: ShapeElement = {
      id: nanoid(), type: "shape",
      x: 200, y: 200, w: 200, h: 200,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, shape,
      ...shapeDefaults(theme),
    };
    addElement(el);
    onClose();
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <button onClick={addText} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <TextT size={18} weight="duotone" /> {t.editor.tools.text}
      </button>
      <button onClick={() => addShape("rect")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Rectangle size={18} weight="duotone" /> {t.editor.rectangle}
      </button>
      <button onClick={() => addShape("circle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Circle size={18} weight="duotone" /> {t.editor.circle}
      </button>
      <button onClick={() => addShape("triangle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Triangle size={18} weight="duotone" /> {t.editor.triangle}
      </button>
      <button onClick={() => { triggerUpload(); onClose(); }} disabled={uploading} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-50">
        <ImageIcon size={18} weight="duotone" /> {uploading ? t.editor.uploading : t.editor.image}
      </button>
    </div>
  );
}

function MobilePropertiesPanel({ onClose }: { onClose: () => void }) {
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const editingMode = useEditorStore((s) => s.editingMode);

  const elements = editingMode === "mobile" && activeSlide?.mobileElements
    ? activeSlide.mobileElements
    : activeSlide?.elements;
  const el = elements?.find((e) => selectedIds.includes(e.id));

  if (!el) {
    onClose();
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      <PositionFields element={el} />
      {el.type === "text" && <TextProperties element={el} />}
      {el.type === "shape" && <ShapeProperties element={el} />}
      {el.type === "image" && <ImageProperties element={el as ImageElement} />}
      {el.type === "arrow" && <ArrowProperties element={el as ArrowElement} />}
      {el.type === "divider" && <DividerProperties element={el as DividerElement} />}
      <AlignControls elementId={el.id} />
      <LayerControls elementId={el.id} />
      <LockToggle element={el} />
      <DeleteButton elementId={el.id} />
    </div>
  );
}
