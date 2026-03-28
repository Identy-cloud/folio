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
  TextT, Rectangle, Circle, Triangle,
} from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { TextElement, ShapeElement } from "@/types/elements";

export function EditorLayout() {
  const presentationId = useEditorStore((s) => s.presentationId);
  const { peers, connected, updateCursor, clearCursor } =
    useCollaboration(presentationId);

  useKeyboard();
  useAutoSave();
  useSessionGuard();

  const [mobilePanel, setMobilePanel] = useState<"slides" | "insert" | null>(null);

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 rounded-t-xl">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
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

  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => { setActiveSlide(i); onClose(); }}
            className={`relative overflow-hidden rounded border-2 transition-colors ${
              i === activeSlideIndex
                ? "border-neutral-900"
                : "border-neutral-200"
            }`}
          >
            <SlidePreview slide={slide} className="w-full" />
            <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[9px] text-white">
              {i + 1}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => { addSlide(); onClose(); }}
        className="w-full rounded border border-dashed border-neutral-300 py-2 text-xs text-neutral-500"
      >
        + Añadir slide
      </button>
    </div>
  );
}

function MobileInsertPanel({ onClose }: { onClose: () => void }) {
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());

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
      <button onClick={addText} className="flex items-center gap-2 rounded border border-neutral-200 px-4 py-3 text-sm hover:bg-neutral-50">
        <TextT size={18} weight="duotone" /> Texto
      </button>
      <button onClick={() => addShape("rect")} className="flex items-center gap-2 rounded border border-neutral-200 px-4 py-3 text-sm hover:bg-neutral-50">
        <Rectangle size={18} weight="duotone" /> Rectángulo
      </button>
      <button onClick={() => addShape("circle")} className="flex items-center gap-2 rounded border border-neutral-200 px-4 py-3 text-sm hover:bg-neutral-50">
        <Circle size={18} weight="duotone" /> Círculo
      </button>
      <button onClick={() => addShape("triangle")} className="flex items-center gap-2 rounded border border-neutral-200 px-4 py-3 text-sm hover:bg-neutral-50">
        <Triangle size={18} weight="duotone" /> Triángulo
      </button>
    </div>
  );
}
