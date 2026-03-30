import React, { useRef, useState, useCallback } from "react";

interface UsePinchZoomOptions {
  minScale?: number;
  maxScale?: number;
  boundsWidth?: number;
  boundsHeight?: number;
}

const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DIST = 30;

function touchDist(a: React.Touch, b: React.Touch): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function clampOffset(ox: number, oy: number, s: number, bw: number, bh: number) {
  if (s <= 1) return { x: 0, y: 0 };
  const maxX = ((s - 1) * bw) / 2;
  const maxY = ((s - 1) * bh) / 2;
  return { x: Math.max(-maxX, Math.min(maxX, ox)), y: Math.max(-maxY, Math.min(maxY, oy)) };
}

export function usePinchZoom(opts: UsePinchZoomOptions = {}) {
  const { minScale = 0.5, maxScale = 3, boundsWidth = 400, boundsHeight = 700 } = opts;
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const pinchRef = useRef<{ initialDist: number; initialScale: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  const reset = useCallback(() => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    scaleRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    pinchRef.current = null;
    panRef.current = null;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      panRef.current = null;
      pinchRef.current = {
        initialDist: touchDist(e.touches[0], e.touches[1]),
        initialScale: scaleRef.current,
      };
      return;
    }
    if (e.touches.length === 1 && scaleRef.current > 1) {
      panRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        origX: offsetRef.current.x,
        origY: offsetRef.current.y,
      };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const d = touchDist(e.touches[0], e.touches[1]);
      const next = Math.max(minScale, Math.min(maxScale, pinchRef.current.initialScale * (d / pinchRef.current.initialDist)));
      scaleRef.current = next;
      setScale(next);
      if (next <= 1) {
        offsetRef.current = { x: 0, y: 0 };
        setOffsetX(0);
        setOffsetY(0);
      }
      return;
    }
    if (e.touches.length === 1 && panRef.current && scaleRef.current > 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panRef.current.startX;
      const dy = e.touches[0].clientY - panRef.current.startY;
      const clamped = clampOffset(panRef.current.origX + dx, panRef.current.origY + dy, scaleRef.current, boundsWidth, boundsHeight);
      offsetRef.current = clamped;
      setOffsetX(clamped.x);
      setOffsetY(clamped.y);
    }
  }, [minScale, maxScale, boundsWidth, boundsHeight]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (pinchRef.current && e.touches.length < 2) {
      pinchRef.current = null;
      if (scaleRef.current <= 1) reset();
      return;
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      panRef.current = null;
      const now = Date.now();
      const t = e.changedTouches[0];
      const last = lastTapRef.current;
      if (last && now - last.time < DOUBLE_TAP_MS && Math.hypot(t.clientX - last.x, t.clientY - last.y) < DOUBLE_TAP_DIST) {
        lastTapRef.current = null;
        reset();
        return;
      }
      lastTapRef.current = { time: now, x: t.clientX, y: t.clientY };
    }
  }, [reset]);

  return {
    scale,
    offsetX,
    offsetY,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    reset,
    isZoomed: scale > 1,
  };
}
