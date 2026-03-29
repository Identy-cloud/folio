"use client";

import { memo } from "react";
import { useEditorStore } from "@/store/editorStore";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 430;
const MOBILE_H = 932;
const SNAP_THRESHOLD = 4;

interface Guide {
  type: "h" | "v";
  pos: number;
}

export const SnapGuides = memo(function SnapGuides() {
  const slide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const editingMode = useEditorStore((s) => s.editingMode);

  if (!slide || selectedIds.length !== 1) return null;

  const isMobile = editingMode === "mobile";
  const SLIDE_WIDTH = isMobile ? MOBILE_W : DESKTOP_W;
  const SLIDE_HEIGHT = isMobile ? MOBILE_H : DESKTOP_H;

  const elements = isMobile && slide.mobileElements ? slide.mobileElements : slide.elements;
  const selected = elements.find((el) => el.id === selectedIds[0]);
  if (!selected) return null;

  const guides: Guide[] = [];
  const cx = selected.x + selected.w / 2;
  const cy = selected.y + selected.h / 2;

  if (Math.abs(cx - SLIDE_WIDTH / 2) < SNAP_THRESHOLD) {
    guides.push({ type: "v", pos: SLIDE_WIDTH / 2 });
  }
  if (Math.abs(cy - SLIDE_HEIGHT / 2) < SNAP_THRESHOLD) {
    guides.push({ type: "h", pos: SLIDE_HEIGHT / 2 });
  }

  for (const el of elements) {
    if (el.id === selected.id) continue;
    const ecx = el.x + el.w / 2;
    const ecy = el.y + el.h / 2;
    if (Math.abs(cx - ecx) < SNAP_THRESHOLD) guides.push({ type: "v", pos: ecx });
    if (Math.abs(cy - ecy) < SNAP_THRESHOLD) guides.push({ type: "h", pos: ecy });
    if (Math.abs(selected.x - el.x) < SNAP_THRESHOLD) guides.push({ type: "v", pos: el.x });
    if (Math.abs(selected.y - el.y) < SNAP_THRESHOLD) guides.push({ type: "h", pos: el.y });
  }

  return (
    <>
      {guides.map((g, i) =>
        g.type === "v" ? (
          <div
            key={`g-${i}`}
            style={{
              position: "absolute",
              left: g.pos,
              top: 0,
              width: 1,
              height: SLIDE_HEIGHT,
              backgroundColor: "#f43f5e",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 9998,
            }}
          />
        ) : (
          <div
            key={`g-${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: g.pos,
              width: SLIDE_WIDTH,
              height: 1,
              backgroundColor: "#f43f5e",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 9998,
            }}
          />
        )
      )}
    </>
  );
});
