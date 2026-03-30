"use client";

import { useState, useRef, useCallback } from "react";

interface UseSlideDragOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface DragState {
  dragIndex: number | null;
  overIndex: number | null;
}

export function useSlideDrag({ onReorder }: UseSlideDragOptions) {
  const [dragState, setDragState] = useState<DragState>({
    dragIndex: null,
    overIndex: null,
  });

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setDragState({ dragIndex: index, overIndex: null });
    },
    [],
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragState((prev) => ({ ...prev, overIndex: index }));
    },
    [],
  );

  const handleDrop = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      if (!Number.isNaN(fromIndex) && fromIndex !== index) {
        onReorder(fromIndex, index);
      }
      setDragState({ dragIndex: null, overIndex: null });
    },
    [onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ dragIndex: null, overIndex: null });
  }, []);

  return { dragState, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
}

interface UseTouchDragOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
  longPressMs?: number;
}

export function useTouchDrag({ onReorder, longPressMs = 500 }: UseTouchDragOptions) {
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);
  const [touchOverIndex, setTouchOverIndex] = useState<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const registerRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      if (el) itemRefs.current.set(index, el);
      else itemRefs.current.delete(index);
    },
    [],
  );

  const handleTouchStart = useCallback(
    (index: number) => (e: React.TouchEvent) => {
      longPressTimer.current = setTimeout(() => {
        setTouchDragIndex(index);
        if (navigator.vibrate) navigator.vibrate(50);
      }, longPressMs);
    },
    [longPressMs],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchDragIndex === null) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        return;
      }
      e.preventDefault();
      const touch = e.touches[0];
      let closest: number | null = null;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const cy = rect.top + rect.height / 2;
        const dist = Math.abs(touch.clientY - cy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = idx;
        }
      });
      setTouchOverIndex(closest);
    },
    [touchDragIndex],
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (touchDragIndex !== null && touchOverIndex !== null && touchDragIndex !== touchOverIndex) {
      onReorder(touchDragIndex, touchOverIndex);
    }
    setTouchDragIndex(null);
    setTouchOverIndex(null);
  }, [touchDragIndex, touchOverIndex, onReorder]);

  return {
    touchDragIndex,
    touchOverIndex,
    registerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
