"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { CanvasElement } from "./CanvasElement";
import { SelectionBox } from "./SelectionBox";
import { SnapGuides } from "./SnapGuides";
import { RemoteCursors } from "./RemoteCursors";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 430;
const MOBILE_H = 932;

interface AwarenessUser {
  name: string;
  color: string;
  cursor: { x: number; y: number; slideIndex: number } | null;
  clientId: number;
}

interface CanvasProps {
  peers?: AwarenessUser[];
  onCursorMove?: (x: number, y: number, slideIndex: number) => void;
  onCursorLeave?: () => void;
}

export function Canvas({ peers = [], onCursorMove, onCursorLeave }: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const [scale, setScale] = useState(0.5);

  const slide = useEditorStore((s) => s.getActiveSlide());
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const activeTool = useEditorStore((s) => s.activeTool);
  const addElement = useEditorStore((s) => s.addElement);
  const editingMode = useEditorStore((s) => s.editingMode);

  const isMobileMode = editingMode === "mobile";
  const canvasW = isMobileMode ? MOBILE_W : DESKTOP_W;
  const canvasH = isMobileMode ? MOBILE_H : DESKTOP_H;

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const pad = rect.width < 768 ? 16 : 48;
    const sx = (rect.width - pad) / canvasW;
    const sy = (rect.height - pad) / canvasH;
    setScale(Math.min(sx, sy, 1));
  }, [canvasW, canvasH]);

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
        fontFamily: "var(--font-dm-sans)",
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

  function handlePointerEnter(e: React.PointerEvent) {
    boundsRef.current = e.currentTarget.getBoundingClientRect();
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!onCursorMove || !boundsRef.current) return;
    const x = (e.clientX - boundsRef.current.left) / scale;
    const y = (e.clientY - boundsRef.current.top) / scale;
    onCursorMove(x, y, activeSlideIndex);
  }

  if (!slide) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-full w-full items-start justify-center overflow-hidden pt-6"
    >
      <div
        data-slide-canvas
        style={{
          width: canvasW,
          height: canvasH,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          backgroundColor: slide.backgroundColor,
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        }}
        onPointerDown={handleCanvasClick}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={onCursorLeave}
      >
        <SnapGuides />
        {(isMobileMode && slide.mobileElements ? slide.mobileElements : slide.elements)
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
          const els = isMobileMode && slide.mobileElements ? slide.mobileElements : slide.elements;
          const el = els.find((e) => e.id === id);
          if (!el) return null;
          return <SelectionBox key={`sel-${id}`} element={el} scale={scale} />;
        })}
        <RemoteCursors peers={peers} />
      </div>
    </div>
  );
}
