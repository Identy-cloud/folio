"use client";

import { useRef, useState, useEffect, useCallback, type WheelEvent as ReactWheelEvent } from "react";
import { MagnifyingGlassPlus, MagnifyingGlassMinus, GridFour } from "@phosphor-icons/react";
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
import { ContextMenu } from "./ContextMenu";

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
  const [zoomOverride, setZoomOverride] = useState<number | null>(null);
  const autoScale = useRef(0.5);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; elementId: string | null } | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [rubberBand, setRubberBand] = useState<{ startX: number; startY: number; curX: number; curY: number } | null>(null);

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
    const fitScale = Math.min(sx, sy, 1);
    autoScale.current = fitScale;
    if (zoomOverride === null) setScale(fitScale);
    setNarrow(isNarrow);
  }, [canvasW, canvasH, zoomOverride]);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  function handleCanvasClick(e: React.PointerEvent) {
    if (e.target === e.currentTarget) {
      clearSelection();
      if (activeTool === "select") {
        const bounds = e.currentTarget.getBoundingClientRect();
        const sx = (e.clientX - bounds.left) / scale;
        const sy = (e.clientY - bounds.top) / scale;
        setRubberBand({ startX: sx, startY: sy, curX: sx, curY: sy });
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    }

    if (activeTool === "text") {
      addTextAtPoint(e);
    }
  }

  function handleCanvasPointerMove(e: React.PointerEvent) {
    handlePointerMove(e);
    if (!rubberBand) return;
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = (e.clientX - bounds.left) / scale;
    const cy = (e.clientY - bounds.top) / scale;
    setRubberBand({ ...rubberBand, curX: cx, curY: cy });
  }

  function handleCanvasPointerUp() {
    if (!rubberBand || !slide) { setRubberBand(null); return; }
    const x1 = Math.min(rubberBand.startX, rubberBand.curX);
    const y1 = Math.min(rubberBand.startY, rubberBand.curY);
    const x2 = Math.max(rubberBand.startX, rubberBand.curX);
    const y2 = Math.max(rubberBand.startY, rubberBand.curY);
    if (x2 - x1 < 5 && y2 - y1 < 5) { setRubberBand(null); return; }

    const els = isMobileMode && slide.mobileElements ? slide.mobileElements : slide.elements;
    const inside = els.filter((el) =>
      el.x >= x1 && el.y >= y1 && el.x + el.w <= x2 && el.y + el.h <= y2
    );
    if (inside.length > 0) {
      useEditorStore.setState({ selectedElementIds: inside.map((e) => e.id) });
    }
    setRubberBand(null);
  }

  function addTextAtPoint(e: React.PointerEvent | React.MouseEvent) {
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

  function handleDoubleClick(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return;
    addTextAtPoint(e);
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

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const elNode = target.closest("[data-element-id]");
    const elementId = elNode?.getAttribute("data-element-id") ?? null;
    if (elementId) {
      useEditorStore.getState().selectElement(elementId);
    }
    setCtxMenu({ x: e.clientX, y: e.clientY, elementId });
  }

  function handleWheel(e: React.WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.1), 2);
      setZoomOverride(next);
      return next;
    });
  }

  function zoomIn() {
    setScale((prev) => {
      const next = Math.min(prev + 0.1, 2);
      setZoomOverride(next);
      return next;
    });
  }

  function zoomOut() {
    setScale((prev) => {
      const next = Math.max(prev - 0.1, 0.1);
      setZoomOverride(next);
      return next;
    });
  }

  function zoomFit() {
    setZoomOverride(null);
    setScale(autoScale.current);
  }

  if (!slide) return null;

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full overflow-hidden touch-none ${dragOver ? "ring-2 ring-inset ring-blue-500/50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
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
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onDoubleClick={handleDoubleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={onCursorLeave}
      >
        {showGrid && (
          <svg className="pointer-events-none absolute inset-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}
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
        {rubberBand && (
          <div
            className="pointer-events-none absolute border border-blue-500/60 bg-blue-500/10"
            style={{
              left: Math.min(rubberBand.startX, rubberBand.curX),
              top: Math.min(rubberBand.startY, rubberBand.curY),
              width: Math.abs(rubberBand.curX - rubberBand.startX),
              height: Math.abs(rubberBand.curY - rubberBand.startY),
            }}
          />
        )}
      </div>

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          elementId={ctxMenu.elementId}
          onClose={() => setCtxMenu(null)}
        />
      )}

      {/* Zoom + Grid controls */}
      <div className="absolute bottom-3 right-3 z-30 hidden md:flex items-center gap-1 rounded bg-neutral-900/80 px-1 py-0.5 backdrop-blur-sm">
        <button
          onClick={() => setShowGrid((v) => !v)}
          className={`rounded p-1 transition-colors ${showGrid ? "text-blue-400" : "text-neutral-400 hover:text-white"}`}
          aria-label="Toggle grid"
          aria-pressed={showGrid}
        >
          <GridFour size={14} />
        </button>
        <div className="w-px h-3 bg-neutral-700" />
        <button onClick={zoomOut} className="rounded p-1 text-neutral-400 hover:text-white transition-colors" aria-label="Zoom out">
          <MagnifyingGlassMinus size={14} />
        </button>
        <button
          onClick={zoomFit}
          className="min-w-[3rem] px-1 text-center text-[10px] text-neutral-300 hover:text-white transition-colors"
          aria-label="Fit to view"
        >
          {Math.round(scale * 100)}%
        </button>
        <button onClick={zoomIn} className="rounded p-1 text-neutral-400 hover:text-white transition-colors" aria-label="Zoom in">
          <MagnifyingGlassPlus size={14} />
        </button>
      </div>
    </div>
  );
}
