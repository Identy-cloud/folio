"use client";

import { useRef, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, TextElement, ShapeElement } from "@/types/elements";

interface Props {
  element: SlideElement;
  scale: number;
  isSelected: boolean;
}

export function CanvasElement({ element, scale, isSelected }: Props) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [editing, setEditing] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    if (element.locked) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    selectElement(element.id, e.shiftKey);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;
    updateElement(element.id, {
      x: dragRef.current.origX + dx,
      y: dragRef.current.origY + dy,
    });
  }

  function onPointerUp() {
    if (dragRef.current) {
      pushHistory();
      dragRef.current = null;
    }
  }

  function onDoubleClick() {
    if (element.type === "text") setEditing(true);
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    setEditing(false);
    updateElement(element.id, { content: e.currentTarget.innerText });
    pushHistory();
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
        opacity: element.opacity,
        cursor: element.locked ? "default" : "move",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: 1,
        zIndex: element.zIndex,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {element.type === "text" && (
        <TextRenderer
          element={element}
          editing={editing}
          onBlur={handleBlur}
        />
      )}
      {element.type === "shape" && <ShapeRenderer element={element} />}
      {element.type === "image" && (
        <img
          src={element.src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: element.objectFit,
            filter: element.filter,
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

function TextRenderer({
  element,
  editing,
  onBlur,
}: {
  element: TextElement;
  editing: boolean;
  onBlur: (e: React.FocusEvent<HTMLDivElement>) => void;
}) {
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" };

  return (
    <div
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={onBlur}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: alignMap[element.verticalAlign],
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        lineHeight: element.lineHeight,
        letterSpacing: `${element.letterSpacing}em`,
        color: element.color,
        textAlign: element.textAlign,
        cursor: editing ? "text" : "inherit",
        outline: "none",
        overflow: "hidden",
        wordBreak: "break-word",
      }}
    >
      <span style={{ width: "100%", textAlign: element.textAlign }}>
        {element.content}
      </span>
    </div>
  );
}

function ShapeRenderer({ element }: { element: ShapeElement }) {
  if (element.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: element.fill,
          border:
            element.strokeWidth > 0
              ? `${element.strokeWidth}px solid ${element.stroke}`
              : "none",
        }}
      />
    );
  }

  if (element.shape === "triangle") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,0 100,100 0,100"
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: element.fill,
        borderRadius: element.borderRadius,
        border:
          element.strokeWidth > 0
            ? `${element.strokeWidth}px solid ${element.stroke}`
            : "none",
      }}
    />
  );
}
