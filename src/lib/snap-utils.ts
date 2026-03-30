import type { SlideElement } from "@/types/elements";

const SNAP_THRESHOLD = 5;

export interface SnapLine {
  type: "h" | "v";
  pos: number;
  isCenter: boolean;
}

export interface SpacingIndicator {
  axis: "h" | "v";
  x: number;
  y: number;
  length: number;
  label: string;
}

interface SnapResult {
  x: number;
  y: number;
  guides: SnapLine[];
  spacing: SpacingIndicator[];
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getEdges(r: Rect) {
  return {
    left: r.x,
    right: r.x + r.w,
    top: r.y,
    bottom: r.y + r.h,
    cx: r.x + r.w / 2,
    cy: r.y + r.h / 2,
  };
}

export function calcSnap(
  dragged: Rect,
  others: SlideElement[],
  canvasW: number,
  canvasH: number,
): SnapResult {
  const guides: SnapLine[] = [];
  let bestDx: number | null = null;
  let bestDy: number | null = null;
  let minDistX = SNAP_THRESHOLD + 1;
  let minDistY = SNAP_THRESHOLD + 1;

  const d = getEdges(dragged);
  const canvasCx = canvasW / 2;
  const canvasCy = canvasH / 2;

  const vTargets: { pos: number; isCenter: boolean }[] = [
    { pos: canvasCx, isCenter: true },
    { pos: 0, isCenter: false },
    { pos: canvasW, isCenter: false },
  ];
  const hTargets: { pos: number; isCenter: boolean }[] = [
    { pos: canvasCy, isCenter: true },
    { pos: 0, isCenter: false },
    { pos: canvasH, isCenter: false },
  ];

  for (const el of others) {
    const e = getEdges(el);
    vTargets.push(
      { pos: e.left, isCenter: false },
      { pos: e.right, isCenter: false },
      { pos: e.cx, isCenter: false },
    );
    hTargets.push(
      { pos: e.top, isCenter: false },
      { pos: e.bottom, isCenter: false },
      { pos: e.cy, isCenter: false },
    );
  }

  const draggedVPoints = [d.left, d.right, d.cx];
  const draggedHPoints = [d.top, d.bottom, d.cy];

  for (const target of vTargets) {
    for (const dp of draggedVPoints) {
      const dist = Math.abs(dp - target.pos);
      if (dist < SNAP_THRESHOLD && dist < minDistX) {
        minDistX = dist;
        bestDx = target.pos - dp;
      }
    }
  }

  for (const target of hTargets) {
    for (const dp of draggedHPoints) {
      const dist = Math.abs(dp - target.pos);
      if (dist < SNAP_THRESHOLD && dist < minDistY) {
        minDistY = dist;
        bestDy = target.pos - dp;
      }
    }
  }

  const snappedX = bestDx !== null ? dragged.x + bestDx : dragged.x;
  const snappedY = bestDy !== null ? dragged.y + bestDy : dragged.y;
  const snapped = getEdges({ x: snappedX, y: snappedY, w: dragged.w, h: dragged.h });

  for (const target of vTargets) {
    if (
      Math.abs(snapped.left - target.pos) < 1 ||
      Math.abs(snapped.right - target.pos) < 1 ||
      Math.abs(snapped.cx - target.pos) < 1
    ) {
      if (!guides.some((g) => g.type === "v" && Math.abs(g.pos - target.pos) < 1)) {
        guides.push({ type: "v", pos: target.pos, isCenter: target.isCenter });
      }
    }
  }

  for (const target of hTargets) {
    if (
      Math.abs(snapped.top - target.pos) < 1 ||
      Math.abs(snapped.bottom - target.pos) < 1 ||
      Math.abs(snapped.cy - target.pos) < 1
    ) {
      if (!guides.some((g) => g.type === "h" && Math.abs(g.pos - target.pos) < 1)) {
        guides.push({ type: "h", pos: target.pos, isCenter: target.isCenter });
      }
    }
  }

  const spacing = calcSpacingIndicators(
    { x: snappedX, y: snappedY, w: dragged.w, h: dragged.h },
    others,
  );

  return { x: snappedX, y: snappedY, guides, spacing };
}

function calcSpacingIndicators(
  dragged: Rect,
  others: SlideElement[],
): SpacingIndicator[] {
  const indicators: SpacingIndicator[] = [];
  if (others.length < 2) return indicators;

  const allRects: Rect[] = [dragged, ...others.map((e) => ({ x: e.x, y: e.y, w: e.w, h: e.h }))];
  const TOLERANCE = 3;

  const sortedH = [...allRects].sort((a, b) => a.x - b.x);
  const hGaps: { gap: number; x: number; y: number; betweenY: number }[] = [];
  for (let i = 0; i < sortedH.length - 1; i++) {
    const gap = sortedH[i + 1].x - (sortedH[i].x + sortedH[i].w);
    if (gap > 0) {
      const midY = Math.max(sortedH[i].y, sortedH[i + 1].y);
      hGaps.push({ gap, x: sortedH[i].x + sortedH[i].w, y: midY + 10, betweenY: midY });
    }
  }

  if (hGaps.length >= 2) {
    const uniqueGaps = new Map<number, typeof hGaps>();
    for (const g of hGaps) {
      const rounded = Math.round(g.gap);
      const bucket = [...uniqueGaps.keys()].find((k) => Math.abs(k - rounded) <= TOLERANCE);
      const key = bucket ?? rounded;
      if (!uniqueGaps.has(key)) uniqueGaps.set(key, []);
      uniqueGaps.get(key)!.push(g);
    }
    for (const [, group] of uniqueGaps) {
      if (group.length >= 2) {
        for (const g of group) {
          indicators.push({
            axis: "h",
            x: g.x,
            y: g.y,
            length: g.gap,
            label: `${Math.round(g.gap)}`,
          });
        }
      }
    }
  }

  const sortedV = [...allRects].sort((a, b) => a.y - b.y);
  const vGaps: { gap: number; x: number; y: number }[] = [];
  for (let i = 0; i < sortedV.length - 1; i++) {
    const gap = sortedV[i + 1].y - (sortedV[i].y + sortedV[i].h);
    if (gap > 0) {
      const midX = Math.max(sortedV[i].x, sortedV[i + 1].x);
      vGaps.push({ gap, x: midX + 10, y: sortedV[i].y + sortedV[i].h });
    }
  }

  if (vGaps.length >= 2) {
    const uniqueGaps = new Map<number, typeof vGaps>();
    for (const g of vGaps) {
      const rounded = Math.round(g.gap);
      const bucket = [...uniqueGaps.keys()].find((k) => Math.abs(k - rounded) <= TOLERANCE);
      const key = bucket ?? rounded;
      if (!uniqueGaps.has(key)) uniqueGaps.set(key, []);
      uniqueGaps.get(key)!.push(g);
    }
    for (const [, group] of uniqueGaps) {
      if (group.length >= 2) {
        for (const g of group) {
          indicators.push({
            axis: "v",
            x: g.x,
            y: g.y,
            length: g.gap,
            label: `${Math.round(g.gap)}`,
          });
        }
      }
    }
  }

  return indicators;
}
