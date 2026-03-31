"use client";

import { useRef, useState, useCallback } from "react";
import type { ImageElement } from "@/types/elements";

interface CropRect { x: number; y: number; w: number; h: number }
type Handle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

interface Props {
  element: ImageElement;
  scale: number;
  onApply: (crop: { cropX: number; cropY: number; cropWidth: number; cropHeight: number }) => void;
  onCancel: () => void;
}

const HS = 22;
const CURSORS: Record<Handle, string> = {
  nw: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", se: "nwse-resize",
  n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
};

export function CropOverlay({ element, scale, onApply, onCancel }: Props) {
  const { w: elW, h: elH } = element;
  const [crop, setCrop] = useState<CropRect>({
    x: (element.cropX ?? 0) * elW, y: (element.cropY ?? 0) * elH,
    w: (element.cropWidth ?? 1) * elW, h: (element.cropHeight ?? 1) * elH,
  });
  const dragRef = useRef<{ handle: Handle | "move"; startX: number; startY: number; orig: CropRect } | null>(null);

  const clamp = useCallback((r: CropRect): CropRect => {
    let { x, y, w, h } = r;
    w = Math.max(w, 20); h = Math.max(h, 20);
    x = Math.max(0, Math.min(x, elW - w)); y = Math.max(0, Math.min(y, elH - h));
    if (x + w > elW) w = elW - x;
    if (y + h > elH) h = elH - y;
    return { x, y, w, h };
  }, [elW, elH]);

  function onPointerDown(handle: Handle | "move", e: React.PointerEvent) {
    e.stopPropagation(); e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { handle, startX: e.clientX, startY: e.clientY, orig: { ...crop } };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    e.stopPropagation();
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;
    const o = dragRef.current.orig;
    const hd = dragRef.current.handle;
    if (hd === "move") { setCrop(clamp({ x: o.x + dx, y: o.y + dy, w: o.w, h: o.h })); return; }
    let nx = o.x, ny = o.y, nw = o.w, nh = o.h;
    if (hd.includes("w")) { nx = o.x + dx; nw = o.w - dx; }
    if (hd.includes("e")) { nw = o.w + dx; }
    if (hd.includes("n")) { ny = o.y + dy; nh = o.h - dy; }
    if (hd.includes("s")) { nh = o.h + dy; }
    setCrop(clamp({ x: nx, y: ny, w: nw, h: nh }));
  }

  function onPointerUp(e: React.PointerEvent) { e.stopPropagation(); dragRef.current = null; }

  const iT = (crop.y / elH) * 100, iR = ((elW - crop.x - crop.w) / elW) * 100;
  const iB = ((elH - crop.y - crop.h) / elH) * 100, iL = (crop.x / elW) * 100;

  const handles: { key: Handle; left: number; top: number }[] = [
    { key: "nw", left: crop.x, top: crop.y },
    { key: "ne", left: crop.x + crop.w, top: crop.y },
    { key: "sw", left: crop.x, top: crop.y + crop.h },
    { key: "se", left: crop.x + crop.w, top: crop.y + crop.h },
    { key: "n", left: crop.x + crop.w / 2, top: crop.y },
    { key: "s", left: crop.x + crop.w / 2, top: crop.y + crop.h },
    { key: "w", left: crop.x, top: crop.y + crop.h / 2 },
    { key: "e", left: crop.x + crop.w, top: crop.y + crop.h / 2 },
  ];

  return (
    <div
      style={{ position: "absolute", left: element.x, top: element.y, width: elW, height: elH,
        transform: `rotate(${element.rotation}deg)`, zIndex: element.zIndex + 9000, touchAction: "none" }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
        clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${iL}% ${iT}%,${iL}% ${100 - iB}%,${100 - iR}% ${100 - iB}%,${100 - iR}% ${iT}%,${iL}% ${iT}%)` }} />
      <div
        style={{ position: "absolute", left: crop.x, top: crop.y, width: crop.w, height: crop.h,
          border: "2px solid #3b82f6", cursor: "move" }}
        onPointerDown={(e) => onPointerDown("move", e)}
      />
      {handles.map((h) => (
        <div
          key={h.key}
          style={{ position: "absolute", width: HS, height: HS, background: "#3b82f6",
            border: "2px solid #fff", borderRadius: 4, cursor: CURSORS[h.key],
            left: h.left - HS / 2, top: h.top - HS / 2 }}
          onPointerDown={(e) => onPointerDown(h.key, e)}
        />
      ))}
      <div className="absolute flex gap-1" style={{
        left: crop.x + crop.w / 2, top: crop.y + crop.h + 8,
        transform: `translate(-50%, 0) scale(${1 / scale})`, transformOrigin: "top center" }}>
        <button
          onClick={(e) => { e.stopPropagation(); onApply({ cropX: crop.x / elW, cropY: crop.y / elH, cropWidth: crop.w / elW, cropHeight: crop.h / elH }); }}
          className="rounded bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500 min-h-[44px] min-w-[44px]"
        >Apply</button>
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="rounded bg-steel px-3 py-1.5 text-[11px] font-medium text-silver hover:bg-steel/80 min-h-[44px] min-w-[44px]"
        >Cancel</button>
      </div>
    </div>
  );
}
