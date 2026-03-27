"use client";

import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import type { TextElement, ShapeElement } from "@/types/elements";

export function ElementPalette() {
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);

  const selectedElement = activeSlide?.elements.find((el) =>
    selectedIds.includes(el.id)
  );

  function addText() {
    const el: TextElement = {
      id: nanoid(),
      type: "text",
      x: 100,
      y: 100,
      w: 400,
      h: 80,
      rotation: 0,
      opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false,
      content: "Escribe aquí",
      fontFamily: "DM Sans",
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: "#0a0a0a",
      textAlign: "left",
      verticalAlign: "top",
    };
    addElement(el);
  }

  function addShape(shape: "rect" | "circle" | "triangle") {
    const el: ShapeElement = {
      id: nanoid(),
      type: "shape",
      x: 200,
      y: 200,
      w: 200,
      h: 200,
      rotation: 0,
      opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false,
      shape,
      fill: "#1a1aff",
      stroke: "transparent",
      strokeWidth: 0,
      borderRadius: shape === "rect" ? 0 : 0,
    };
    addElement(el);
  }

  return (
    <div className="flex w-56 flex-col border-l border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-3 py-2">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Insertar
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <button
          onClick={addText}
          className="w-full rounded border border-neutral-200 px-3 py-2 text-left text-xs hover:bg-neutral-50"
        >
          T Texto
        </button>
        <button
          onClick={() => addShape("rect")}
          className="w-full rounded border border-neutral-200 px-3 py-2 text-left text-xs hover:bg-neutral-50"
        >
          ▬ Rectángulo
        </button>
        <button
          onClick={() => addShape("circle")}
          className="w-full rounded border border-neutral-200 px-3 py-2 text-left text-xs hover:bg-neutral-50"
        >
          ● Círculo
        </button>
        <button
          onClick={() => addShape("triangle")}
          className="w-full rounded border border-neutral-200 px-3 py-2 text-left text-xs hover:bg-neutral-50"
        >
          ▲ Triángulo
        </button>
      </div>

      {selectedElement && (
        <div className="border-t border-neutral-200 p-3 space-y-2">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Propiedades
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
            <span>X: {Math.round(selectedElement.x)}</span>
            <span>Y: {Math.round(selectedElement.y)}</span>
            <span>W: {Math.round(selectedElement.w)}</span>
            <span>H: {Math.round(selectedElement.h)}</span>
            <span>Rot: {Math.round(selectedElement.rotation)}°</span>
            <span>Z: {selectedElement.zIndex}</span>
          </div>
        </div>
      )}
    </div>
  );
}
