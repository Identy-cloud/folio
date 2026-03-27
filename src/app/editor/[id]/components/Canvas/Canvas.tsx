"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { CanvasElement } from "./CanvasElement";
import { SelectionBox } from "./SelectionBox";
import { SnapGuides } from "./SnapGuides";

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function Canvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const slide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const activeTool = useEditorStore((s) => s.activeTool);
  const addElement = useEditorStore((s) => s.addElement);

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const sx = (rect.width - 48) / SLIDE_WIDTH;
    const sy = (rect.height - 48) / SLIDE_HEIGHT;
    setScale(Math.min(sx, sy, 1));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  function handleCanvasClick(e: React.PointerEvent) {
    if (e.target === e.currentTarget) {
      clearSelection();
    }

    if (activeTool === "text") {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / scale;
      const y = (e.clientY - bounds.top) / scale;
      addElement({
        id: nanoid(),
        type: "text",
        x,
        y,
        w: 400,
        h: 80,
        rotation: 0,
        opacity: 1,
        zIndex: (slide?.elements.length ?? 0) + 1,
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
      });
    }
  }

  if (!slide) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          backgroundColor: slide.backgroundColor,
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
        }}
        onPointerDown={handleCanvasClick}
      >
        <SnapGuides scale={scale} />
        {slide.elements
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              scale={scale}
              isSelected={selectedIds.includes(el.id)}
            />
          ))}
        {selectedIds.map((id) => {
          const el = slide.elements.find((e) => e.id === id);
          if (!el) return null;
          return <SelectionBox key={`sel-${id}`} element={el} scale={scale} />;
        })}
      </div>
    </div>
  );
}
