"use client";

import { memo } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { SnapLine, SpacingIndicator } from "@/lib/snap-utils";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const MOBILE_W = 430;
const MOBILE_H = 932;

export const SnapGuides = memo(function SnapGuides() {
  const guides = useEditorStore((s) => s.snapGuides);
  const spacing = useEditorStore((s) => s.snapSpacing);
  const editingMode = useEditorStore((s) => s.editingMode);

  const cW = editingMode === "mobile" ? MOBILE_W : DESKTOP_W;
  const cH = editingMode === "mobile" ? MOBILE_H : DESKTOP_H;

  if (guides.length === 0 && spacing.length === 0) return null;

  return (
    <>
      {guides.map((g: SnapLine, i: number) => (
        <GuideLine key={`g-${i}`} guide={g} cW={cW} cH={cH} />
      ))}
      {spacing.map((s: SpacingIndicator, i: number) => (
        <SpacingLabel key={`s-${i}`} indicator={s} />
      ))}
    </>
  );
});

function GuideLine({ guide, cW, cH }: { guide: SnapLine; cW: number; cH: number }) {
  const color = guide.isCenter ? "#ef4444" : "#3b82f6";
  if (guide.type === "v") {
    return (
      <div
        style={{
          position: "absolute",
          left: guide.pos,
          top: 0,
          width: 1,
          height: cH,
          backgroundColor: color,
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: guide.pos,
        width: cW,
        height: 1,
        backgroundColor: color,
        opacity: 0.7,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}

function SpacingLabel({ indicator }: { indicator: SpacingIndicator }) {
  const isH = indicator.axis === "h";
  return (
    <div
      style={{
        position: "absolute",
        left: indicator.x,
        top: indicator.y,
        width: isH ? indicator.length : 1,
        height: isH ? 1 : indicator.length,
        backgroundColor: "#a855f7",
        opacity: 0.5,
        pointerEvents: "none",
        zIndex: 9997,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: isH ? "50%" : 6,
          top: isH ? -12 : "50%",
          transform: isH ? "translateX(-50%)" : "translateY(-50%)",
          fontSize: 9,
          color: "#a855f7",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "1px 4px",
          borderRadius: 2,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {indicator.label}px
      </div>
    </div>
  );
}
