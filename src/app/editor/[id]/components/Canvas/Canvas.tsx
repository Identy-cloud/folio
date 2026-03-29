"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { textDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import { toast } from "sonner";
import type { ImageElement } from "@/types/elements";
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
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const slide = useEditorStore((s) => s.getActiveSlide());
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const activeTool = useEditorStore((s) => s.activeTool);
  const addElement = useEditorStore((s) => s.addElement);
  const theme = useEditorStore((s) => THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const editingMode = useEditorStore((s) => s.editingMode);

  const isMobileMode = editingMode === "mobile";
  const canvasW = isMobileMode ? MOBILE_W : DESKTOP_W;
  const canvasH = isMobileMode ? MOBILE_H : DESKTOP_H;

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const isNarrow = rect.width < 768;
    const hPad = isNarrow ? 16 : 48;
    const vPad = isNarrow ? 16 : 48;
    const sx = (rect.width - hPad) / canvasW;
    const sy = (rect.height - vPad) / canvasH;
    setScale(Math.min(sx, sy, 1));
    setNarrow(isNarrow);
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
        content: "",
        ...textDefaults(theme),
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

  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) return;

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, filename: file.name, fileSize: file.size }),
      });

      if (res.status === 403) {
        toast.error("Storage limit reached");
        return;
      }
      if (!res.ok) { toast.error("Upload error"); return; }

      const { signedUrl, publicUrl } = await res.json();
      const putRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) { toast.error("Upload failed"); return; }

      const bounds = (e.target as HTMLElement).closest("[data-slide-canvas]")?.getBoundingClientRect();
      const dropX = bounds ? (e.clientX - bounds.left) / scale : 400;
      const dropY = bounds ? (e.clientY - bounds.top) / scale : 200;

      const currentSlide = useEditorStore.getState().getActiveSlide();
      const el: ImageElement = {
        id: nanoid(),
        type: "image",
        x: dropX - 200,
        y: dropY - 150,
        w: 400,
        h: 300,
        rotation: 0,
        opacity: 1,
        zIndex: (currentSlide?.elements.length ?? 0) + 1,
        locked: false,
        src: publicUrl,
        objectFit: "cover",
        filter: "",
        isPlaceholder: false,
      };

      addElement(el);
      toast.success("Image inserted");
    } catch {
      toast.error("Connection error");
    }
  }

  if (!slide) return null;

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full overflow-hidden touch-none ${dragOver ? "ring-2 ring-inset ring-blue-500/50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        data-slide-canvas
        style={{
          width: canvasW,
          height: canvasH,
          position: "absolute",
          top: narrow
            ? Math.min(12 + (canvasH * scale) / 2, wrapperRef.current ? wrapperRef.current.clientHeight / 2 : 12 + (canvasH * scale) / 2)
            : "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
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
