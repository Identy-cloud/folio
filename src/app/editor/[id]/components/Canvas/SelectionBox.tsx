"use client";

import { useRef, memo } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/elements";

type HandlePos = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "rotate";

const HANDLES: { pos: HandlePos; x: string; y: string; cursor: string }[] = [
  { pos: "nw", x: "0%", y: "0%", cursor: "nwse-resize" },
  { pos: "n", x: "50%", y: "0%", cursor: "ns-resize" },
  { pos: "ne", x: "100%", y: "0%", cursor: "nesw-resize" },
  { pos: "e", x: "100%", y: "50%", cursor: "ew-resize" },
  { pos: "se", x: "100%", y: "100%", cursor: "nwse-resize" },
  { pos: "s", x: "50%", y: "100%", cursor: "ns-resize" },
  { pos: "sw", x: "0%", y: "100%", cursor: "nesw-resize" },
  { pos: "w", x: "0%", y: "50%", cursor: "ew-resize" },
];

interface Props {
  element: SlideElement;
  scale: number;
}

export const SelectionBox = memo(function SelectionBox({ element, scale }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const dragRef = useRef<{
    handle: HandlePos;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    origRot: number;
    screenCx: number;
    screenCy: number;
  } | null>(null);

  function onHandleDown(e: React.PointerEvent, handle: HandlePos) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const canvas = (e.currentTarget as HTMLElement).closest("[data-slide-canvas]");
    const rect = canvas?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const screenCx = rect.left + (element.x + element.w / 2) * scale;
    const screenCy = rect.top + (element.y + element.h / 2) * scale;

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.w,
      origH: element.h,
      origRot: element.rotation,
      screenCx,
      screenCy,
    };
  }

  function onHandleMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.startX) / scale;
    const dy = (e.clientY - d.startY) / scale;

    if (d.handle === "rotate") {
      const angle = Math.atan2(e.clientY - d.screenCy, e.clientX - d.screenCx) * (180 / Math.PI);
      const startAngle = Math.atan2(d.startY - d.screenCy, d.startX - d.screenCx) * (180 / Math.PI);
      updateElement(element.id, {
        rotation: d.origRot + (angle - startAngle),
      });
      return;
    }

    const updates: Partial<SlideElement> = {};
    const h = d.handle;

    if (h.includes("e")) {
      updates.w = Math.max(20, d.origW + dx);
    }
    if (h.includes("w")) {
      updates.w = Math.max(20, d.origW - dx);
      updates.x = d.origX + dx;
    }
    if (h.includes("s")) {
      updates.h = Math.max(20, d.origH + dy);
    }
    if (h.includes("n")) {
      updates.h = Math.max(20, d.origH - dy);
      updates.y = d.origY + dy;
    }

    updateElement(element.id, updates);
  }

  function onHandleUp() {
    if (dragRef.current) {
      pushHistory();
      dragRef.current = null;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        transform: `rotate(${element.rotation}deg)`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Dimension label */}
      {dragRef.current && (
        <div
          className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] text-white whitespace-nowrap"
          style={{ transform: `translate(-50%, 0) scale(${1 / scale})`, transformOrigin: "bottom center" }}
        >
          {Math.round(element.w)} × {Math.round(element.h)}
          {element.rotation !== 0 && ` · ${Math.round(element.rotation)}°`}
        </div>
      )}
      {HANDLES.filter((h) => {
        const screenW = element.w * scale;
        const screenH = element.h * scale;
        if (screenW < 80 || screenH < 80) {
          return h.pos.length === 2;
        }
        return true;
      }).map((h) => (
        <div
          key={h.pos}
          style={{
            position: "absolute",
            left: h.x,
            top: h.y,
            width: 44,
            height: 44,
            transform: "translate(-50%, -50%)",
            cursor: h.cursor,
            pointerEvents: "auto",
            zIndex: 10000,
            touchAction: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPointerDown={(e) => onHandleDown(e, h.pos)}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
        >
          <div style={{
            width: 8,
            height: 8,
            backgroundColor: "white",
            border: "2px solid #3b82f6",
            borderRadius: h.pos.length === 1 ? 0 : 0,
          }} />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -30,
          width: 44,
          height: 44,
          transform: "translateX(-50%)",
          cursor: "grab",
          pointerEvents: "auto",
          zIndex: 10000,
          touchAction: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPointerDown={(e) => onHandleDown(e, "rotate")}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
      >
        <div style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
        }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -30,
          width: 1,
          height: 30,
          backgroundColor: "#3b82f6",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
});
