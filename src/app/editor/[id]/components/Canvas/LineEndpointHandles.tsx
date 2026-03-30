"use client";

import { useRef, memo } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { LineElement } from "@/types/elements";

interface Props {
  element: LineElement;
  scale: number;
}

export const LineEndpointHandles = memo(function LineEndpointHandles({ element, scale }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const dragRef = useRef<{
    endpoint: "start" | "end";
    startClientX: number;
    startClientY: number;
    origX1: number;
    origY1: number;
    origX2: number;
    origY2: number;
    origElX: number;
    origElY: number;
    origElW: number;
    origElH: number;
  } | null>(null);

  function onHandleDown(e: React.PointerEvent, endpoint: "start" | "end") {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      endpoint,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX1: element.x1,
      origY1: element.y1,
      origX2: element.x2,
      origY2: element.y2,
      origElX: element.x,
      origElY: element.y,
      origElW: element.w,
      origElH: element.h,
    };
  }

  function onHandleMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.startClientX) / scale;
    const dy = (e.clientY - d.startClientY) / scale;

    let newX1 = d.origX1;
    let newY1 = d.origY1;
    let newX2 = d.origX2;
    let newY2 = d.origY2;

    if (d.endpoint === "start") {
      newX1 = d.origX1 + dx;
      newY1 = d.origY1 + dy;
    } else {
      newX2 = d.origX2 + dx;
      newY2 = d.origY2 + dy;
    }

    const absX1 = d.origElX + newX1;
    const absY1 = d.origElY + newY1;
    const absX2 = d.origElX + newX2;
    const absY2 = d.origElY + newY2;

    const minX = Math.min(absX1, absX2);
    const minY = Math.min(absY1, absY2);
    const maxX = Math.max(absX1, absX2);
    const maxY = Math.max(absY1, absY2);

    const pad = 4;
    const newElX = minX - pad;
    const newElY = minY - pad;
    const newElW = Math.max(maxX - minX + pad * 2, 8);
    const newElH = Math.max(maxY - minY + pad * 2, 8);

    updateElement(element.id, {
      x: newElX,
      y: newElY,
      w: newElW,
      h: newElH,
      x1: absX1 - newElX,
      y1: absY1 - newElY,
      x2: absX2 - newElX,
      y2: absY2 - newElY,
    });
  }

  function onHandleUp() {
    if (dragRef.current) {
      pushHistory();
      dragRef.current = null;
    }
  }

  const absStartX = element.x + element.x1;
  const absStartY = element.y + element.y1;
  const absEndX = element.x + element.x2;
  const absEndY = element.y + element.y2;

  return (
    <>
      <EndpointHandle
        x={absStartX}
        y={absStartY}
        label="Line start"
        onPointerDown={(e) => onHandleDown(e, "start")}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
      />
      <EndpointHandle
        x={absEndX}
        y={absEndY}
        label="Line end"
        onPointerDown={(e) => onHandleDown(e, "end")}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
      />
    </>
  );
});

function EndpointHandle({
  x,
  y,
  label,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  x: number;
  y: number;
  label: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}) {
  return (
    <div
      aria-label={label}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 44,
        height: 44,
        transform: "translate(-50%, -50%)",
        cursor: "crosshair",
        pointerEvents: "auto",
        zIndex: 10001,
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}
