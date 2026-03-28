"use client";

import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import { TextT, Rectangle, Circle, Triangle, Image as ImageIcon } from "@phosphor-icons/react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { PositionFields } from "./PositionFields";
import { TextProperties } from "./TextProperties";
import { ShapeProperties } from "./ShapeProperties";
import { DeleteButton } from "./DeleteButton";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { TextElement, ShapeElement } from "@/types/elements";

export function ElementPalette() {
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const updateSlideBackground = useEditorStore((s) => s.updateSlideBackground);
  const { trigger: triggerUpload, uploading } = useImageUpload();

  const selectedElement = activeSlide?.elements.find((el) =>
    selectedIds.includes(el.id)
  );

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
  }

  const btn = "flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800";

  return (
    <div className="flex w-56 flex-col border-l border-neutral-800 bg-[#161616]">
      <div className="border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Insertar
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        <button onClick={addText} className={btn}><TextT size={16} weight="duotone" /> Texto</button>
        <button onClick={() => addShape("rect")} className={btn}><Rectangle size={16} weight="duotone" /> Rectángulo</button>
        <button onClick={() => addShape("circle")} className={btn}><Circle size={16} weight="duotone" /> Círculo</button>
        <button onClick={() => addShape("triangle")} className={btn}><Triangle size={16} weight="duotone" /> Triángulo</button>
        <button onClick={triggerUpload} disabled={uploading} className={`${btn} disabled:opacity-50`}>
          <ImageIcon size={16} weight="duotone" /> {uploading ? "Subiendo..." : "Imagen"}
        </button>
      </div>

      {selectedElement ? (
        <div className="flex-1 overflow-y-auto border-t border-neutral-800 p-3 space-y-4">
          <PositionFields element={selectedElement} />
          {selectedElement.type === "text" && <TextProperties element={selectedElement} />}
          {selectedElement.type === "shape" && <ShapeProperties element={selectedElement} />}
          <DeleteButton elementId={selectedElement.id} />
        </div>
      ) : activeSlide && (
        <div className="border-t border-neutral-800 p-3 space-y-3">
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            Fondo del slide
          </span>
          <ColorPicker
            value={activeSlide.backgroundColor}
            onChange={updateSlideBackground}
          />
        </div>
      )}
    </div>
  );
}
