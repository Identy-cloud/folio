"use client";

import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import { ALL_FONTS } from "@/lib/templates/themes";
import { TextT, Rectangle, Circle, Triangle } from "@phosphor-icons/react";
import type { TextElement, ShapeElement } from "@/types/elements";

export function ElementPalette() {
  const addElement = useEditorStore((s) => s.addElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);

  const selectedElement = activeSlide?.elements.find((el) =>
    selectedIds.includes(el.id)
  );

  function addText() {
    const el: TextElement = {
      id: nanoid(),
      type: "text",
      x: 100, y: 100, w: 400, h: 80,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false,
      content: "Escribe aquí",
      fontFamily: "var(--font-dm-sans)",
      fontSize: 32, fontWeight: 400, lineHeight: 1.4,
      letterSpacing: 0, color: "#0a0a0a",
      textAlign: "left", verticalAlign: "top",
    };
    addElement(el);
  }

  function addShape(shape: "rect" | "circle" | "triangle") {
    const el: ShapeElement = {
      id: nanoid(),
      type: "shape",
      x: 200, y: 200, w: 200, h: 200,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, shape,
      fill: "#1a1aff", stroke: "transparent",
      strokeWidth: 0, borderRadius: 0,
    };
    addElement(el);
  }

  return (
    <div className="flex w-56 flex-col border-l border-neutral-800 bg-[#161616]">
      <div className="border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Insertar
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <button onClick={addText} className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800">
          <TextT size={16} weight="duotone" /> Texto
        </button>
        <button onClick={() => addShape("rect")} className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800">
          <Rectangle size={16} weight="duotone" /> Rectángulo
        </button>
        <button onClick={() => addShape("circle")} className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800">
          <Circle size={16} weight="duotone" /> Círculo
        </button>
        <button onClick={() => addShape("triangle")} className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800">
          <Triangle size={16} weight="duotone" /> Triángulo
        </button>
      </div>

      {selectedElement && (
        <div className="border-t border-neutral-800 p-3 space-y-3">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Propiedades
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
            <span>X: {Math.round(selectedElement.x)}</span>
            <span>Y: {Math.round(selectedElement.y)}</span>
            <span>W: {Math.round(selectedElement.w)}</span>
            <span>H: {Math.round(selectedElement.h)}</span>
            <span>Rot: {Math.round(selectedElement.rotation)}°</span>
            <span>Z: {selectedElement.zIndex}</span>
          </div>

          {selectedElement.type === "text" && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Fuente
              </span>
              <div className="space-y-1">
                {ALL_FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      updateElement(selectedElement.id, { fontFamily: f.value });
                      pushHistory();
                    }}
                    className={`block w-full rounded px-2 py-1.5 text-left text-sm transition-colors ${
                      selectedElement.fontFamily === f.value
                        ? "bg-white text-[#161616]"
                        : "hover:bg-neutral-800 text-neutral-300"
                    }`}
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
