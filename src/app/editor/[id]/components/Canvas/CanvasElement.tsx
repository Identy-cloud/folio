"use client";

import { useRef, useState, memo, useMemo, useCallback } from "react";
import DOMPurify from "dompurify";
import { nanoid } from "nanoid";
import { Camera } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, TextElement } from "@/types/elements";
import { ShapeRenderer, ArrowRenderer, DividerRenderer, EmbedRenderer } from "@/components/elements";

interface Props {
  element: SlideElement;
  scale: number;
  isSelected: boolean;
}

export const CanvasElement = memo(function CanvasElement({ element, scale, isSelected }: Props) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const setEditingTextId = useEditorStore((s) => s.setEditingTextId);
  const editing = useEditorStore((s) => s.editingTextId === element.id);
  const isBusy = useEditorStore((s) => s.busyElementIds.has(element.id));
  const setEditing = useCallback((v: boolean) => setEditingTextId(v ? element.id : null), [element.id, setEditingTextId]);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    if (element.locked || isBusy) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    // Alt+drag = clone element and drag the clone
    if (e.altKey) {
      const store = useEditorStore.getState();
      const cloneId = nanoid();
      store.addElement({ ...element, id: cloneId } as SlideElement);
      selectElement(cloneId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: element.x,
        origY: element.y,
      };
      return;
    }

    selectElement(element.id, e.shiftKey);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
    };

    if (element.type === "text" || element.type === "image") {
      longPressRef.current = setTimeout(() => {
        longPressRef.current = null;
        dragRef.current = null;
        if (element.type === "text") setEditing(true);
        if (element.type === "image") {
          window.dispatchEvent(new CustomEvent("folio:replace-image", { detail: element.id }));
        }
      }, 500);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;
    if (longPressRef.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
    if (!dragging && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) setDragging(true);
    let newX = dragRef.current.origX + dx;
    let newY = dragRef.current.origY + dy;
    if (useEditorStore.getState().snapToGrid) {
      const GRID = 40;
      newX = Math.round(newX / GRID) * GRID;
      newY = Math.round(newY / GRID) * GRID;
    }
    updateElement(element.id, { x: newX, y: newY });
  }

  function onPointerUp() {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
    if (dragRef.current) {
      pushHistory();
      dragRef.current = null;
      setDragging(false);
    }
  }

  function onDoubleClick() {
    if (isBusy) return;
    if (element.type === "text") setEditing(true);
    if (element.type === "image") {
      window.dispatchEvent(new CustomEvent("folio:replace-image", { detail: element.id }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    setEditing(false);
    updateElement(element.id, { content: e.currentTarget.innerText });
    pushHistory();
  }

  return (
    <div
      data-element-id={element.id}
      title={`${element.type}${element.type === "text" ? `: ${(element as import("@/types/elements").TextElement).content.replace(/<[^>]*>/g, "").slice(0, 30)}` : ""} — ${Math.round(element.w)}×${Math.round(element.h)}`}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.w,
        height: element.h,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        cursor: element.locked ? "default" : "move",
        touchAction: "none",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: 1,
        zIndex: element.zIndex,
        boxShadow: element.shadow
          ? `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`
          : undefined,
        border: (element.borderWidth ?? 0) > 0 ? `${element.borderWidth}px solid ${element.borderColor ?? "#000"}` : undefined,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {dragging && (
        <div
          className="pointer-events-none absolute -bottom-5 left-1/2 z-50 whitespace-nowrap rounded bg-neutral-900/90 px-1.5 py-0.5 text-[9px] text-neutral-300"
          style={{ transform: `translate(-50%, 0) scale(${1 / scale})`, transformOrigin: "top center" }}
        >
          {Math.round(element.x)}, {Math.round(element.y)}
        </div>
      )}
      {element.type === "text" && (
        <TextRenderer
          element={element}
          editing={editing}
          onBlur={handleBlur}
        />
      )}
      {element.type === "shape" && <ShapeRenderer element={element} />}
      {element.type === "arrow" && <ArrowRenderer element={element} />}
      {element.type === "divider" && <DividerRenderer element={element} />}
      {element.type === "embed" && <EmbedRenderer element={element} />}
      {element.type === "image" && (
        <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: element.borderRadius ?? 0, overflow: "hidden" }}>
          <img
            src={element.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: element.objectFit,
              filter: element.filter || undefined,
              transform: `${element.flipX ? "scaleX(-1)" : ""} ${element.flipY ? "scaleY(-1)" : ""}`.trim() || undefined,
            }}
            draggable={false}
          />
          {element.isPlaceholder && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
                opacity: 0,
                transition: "opacity 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
              onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("folio:replace-image", { detail: element.id })); }}
            >
              <span style={{ color: "white", fontSize: 14, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}>
                <Camera size={18} weight="duotone" /> REPLACE
              </span>
            </div>
          )}
        </div>
      )}
      {isBusy && <BusyOverlay />}
    </div>
  );
});

function BusyOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
        zIndex: 9999,
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          border: "2px solid rgba(255,255,255,0.2)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "busy-spin 0.6s linear infinite",
        }}
      />
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
  const sanitized = useMemo(
    () => DOMPurify.sanitize(element.content),
    [element.content]
  );

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
        fontStyle: element.fontStyle ?? "normal",
        textDecoration: element.textDecoration ?? "none",
        WebkitTextStroke: element.textStroke ? `${element.textStroke.width}px ${element.textStroke.color}` : undefined,
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
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}
