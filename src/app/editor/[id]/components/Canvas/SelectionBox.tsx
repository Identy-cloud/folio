"use client";

import { useRef } from "react";
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

export function SelectionBox({ element, scale }: Props) {
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
    centerX: number;
    centerY: number;
  } | null>(null);

  function onHandleDown(e: React.PointerEvent, handle: HandlePos) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const centerX = element.x + element.w / 2;
    const centerY = element.y + element.h / 2;

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.w,
      origH: element.h,
      origRot: element.rotation,
      centerX,
      centerY,
    };
  }

  function onHandleMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.startX) / scale;
    const dy = (e.clientY - d.startY) / scale;

    if (d.handle === "rotate") {
      const cx = d.centerX;
      const cy = d.centerY;
      const angle =
        Math.atan2(e.clientY / scale - cy, e.clientX / scale - cx) *
        (180 / Math.PI);
      const startAngle =
        Math.atan2(d.startY / scale - cy, d.startX / scale - cx) *
        (180 / Math.PI);
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
      {HANDLES.map((h) => (
        <div
          key={h.pos}
          style={{
            position: "absolute",
            left: h.x,
            top: h.y,
            width: 8,
            height: 8,
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "2px solid #3b82f6",
            cursor: h.cursor,
            pointerEvents: "auto",
            zIndex: 10000,
          }}
          onPointerDown={(e) => onHandleDown(e, h.pos)}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -24,
          width: 10,
          height: 10,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
          cursor: "grab",
          pointerEvents: "auto",
          zIndex: 10000,
        }}
        onPointerDown={(e) => onHandleDown(e, "rotate")}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -24,
          width: 1,
          height: 24,
          backgroundColor: "#3b82f6",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
