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
  StackSimple, PlusCircle, X,
  TextT, Rectangle, Circle, Triangle, Image as ImageIcon,
} from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { TextElement, ShapeElement } from "@/types/elements";
import { useImageUpload } from "../hooks/useImageUpload";

export function EditorLayout() {
  const presentationId = useEditorStore((s) => s.presentationId);
  const { peers, connected, updateCursor, clearCursor } =
    useCollaboration(presentationId);

  useKeyboard();
  useAutoSave();
  useSessionGuard();

  const [mobilePanel, setMobilePanel] = useState<"slides" | "insert" | null>(null);

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
        >
          <StackSimple size={20} weight="duotone" />
        </button>
        <button
          onClick={() => setMobilePanel(mobilePanel === "insert" ? null : "insert")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg active:scale-95 transition-transform"
        >
          <PlusCircle size={20} weight="duotone" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobilePanel && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobilePanel(null)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-xl bg-[#1e1e1e] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-neutral-700 bg-[#1e1e1e] px-4 py-3 rounded-t-xl">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {mobilePanel === "slides" ? "Slides" : "Insertar"}
              </span>
              <button
                onClick={() => setMobilePanel(null)}
                className="p-1 text-neutral-400"
              >
                <X size={18} />
              </button>
            </div>
            {mobilePanel === "slides" ? (
              <MobileSlidePanel onClose={() => setMobilePanel(null)} />
            ) : (
              <MobileInsertPanel onClose={() => setMobilePanel(null)} />
            )}
          </div>
        </div>
      )}

      <Onboarding />
    </div>
  );
}

function MobileSlidePanel({ onClose }: { onClose: () => void }) {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const deleteSlide = useEditorStore((s) => s.deleteSlide);

  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`relative overflow-hidden rounded border-2 transition-colors ${
              i === activeSlideIndex
                ? "border-blue-500"
                : "border-neutral-700"
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
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-[10px] text-white"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => { addSlide(); onClose(); }}
        className="w-full rounded border border-dashed border-neutral-600 py-2 text-xs text-neutral-400"
      >
        + Añadir slide
      </button>
    </div>
  );
}

function MobileInsertPanel({ onClose }: { onClose: () => void }) {
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const { trigger: triggerUpload, uploading } = useImageUpload();

  function addText() {
    const el: TextElement = {
      id: nanoid(), type: "text",
      x: 100, y: 100, w: 400, h: 80,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, content: "Escribe aquí",
      fontFamily: "var(--font-dm-sans)",
      fontSize: 32, fontWeight: 400, lineHeight: 1.4,
      letterSpacing: 0, color: "#0a0a0a",
      textAlign: "left", verticalAlign: "top",
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
      fill: "#1a1aff", stroke: "transparent",
      strokeWidth: 0, borderRadius: 0,
    };
    addElement(el);
    onClose();
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <button onClick={addText} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <TextT size={18} weight="duotone" /> Texto
      </button>
      <button onClick={() => addShape("rect")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Rectangle size={18} weight="duotone" /> Rectángulo
      </button>
      <button onClick={() => addShape("circle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Circle size={18} weight="duotone" /> Círculo
      </button>
      <button onClick={() => addShape("triangle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Triangle size={18} weight="duotone" /> Triángulo
      </button>
      <button onClick={() => { triggerUpload(); onClose(); }} disabled={uploading} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-50">
        <ImageIcon size={18} weight="duotone" /> {uploading ? "Subiendo..." : "Imagen"}
      </button>
    </div>
  );
}
