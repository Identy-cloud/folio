"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { Copy, Clipboard, Trash, CopySimple, LockSimple, LockSimpleOpen } from "@phosphor-icons/react";

interface Props {
  x: number;
  y: number;
  elementId: string | null;
  onClose: () => void;
}

export function ContextMenu({ x, y, elementId, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [onClose]);

  const store = useEditorStore.getState();
  const slide = store.getActiveSlide();
  const elements = store.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements;
  const el = elementId ? elements?.find((e) => e.id === elementId) : null;

  const btn = "flex w-full items-center gap-2 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors";

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Context menu"
      className="fixed z-[100] min-w-[160px] rounded border border-neutral-700 bg-[#1e1e1e] py-1 shadow-xl"
      style={{ left: x, top: y }}
    >
      {el && (
        <>
          <button className={btn} onClick={() => { store.copySelection(); onClose(); }}>
            <Copy size={14} /> Copy
          </button>
          <button className={btn} onClick={() => { store.duplicateElement(el.id); onClose(); }}>
            <CopySimple size={14} /> Duplicate
          </button>
          <button className={btn} onClick={() => {
            const r = el.rotation === 0 ? 0 : -el.rotation;
            store.updateElement(el.id, { rotation: el.rotation + 90 });
            store.pushHistory();
            onClose();
          }}>
            Rotate 90°
          </button>
          <div className="my-1 h-px bg-neutral-700" />
          <button className={btn} onClick={() => { store.bringToFront(el.id); onClose(); }}>
            Bring to front
          </button>
          <button className={btn} onClick={() => { store.sendToBack(el.id); onClose(); }}>
            Send to back
          </button>
          <div className="my-1 h-px bg-neutral-700" />
          <button className={btn} onClick={() => {
            store.updateElement(el.id, { x: (1920 - el.w) / 2, y: (1080 - el.h) / 2 });
            store.pushHistory();
            onClose();
          }}>
            Center on canvas
          </button>
          <button className={btn} onClick={() => {
            store.updateElement(el.id, { x: (1920 - el.w) / 2 });
            store.pushHistory();
            onClose();
          }}>
            Center H
          </button>
          <button className={btn} onClick={() => {
            store.updateElement(el.id, { y: (1080 - el.h) / 2 });
            store.pushHistory();
            onClose();
          }}>
            Center V
          </button>
          <div className="my-1 h-px bg-neutral-700" />
          <button className={btn} onClick={() => {
            store.updateElement(el.id, { x: 1920 - el.x - el.w });
            store.pushHistory();
            onClose();
          }}>
            Mirror H
          </button>
          <button className={btn} onClick={() => {
            store.updateElement(el.id, { y: 1080 - el.y - el.h });
            store.pushHistory();
            onClose();
          }}>
            Mirror V
          </button>
          <button
            className={btn}
            onClick={() => {
              store.updateElement(el.id, { locked: !el.locked });
              store.pushHistory();
              onClose();
            }}
          >
            {el.locked ? <LockSimpleOpen size={14} /> : <LockSimple size={14} />}
            {el.locked ? "Unlock" : "Lock"}
          </button>
          <div className="my-1 h-px bg-neutral-700" />
          <button
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-neutral-700 transition-colors"
            onClick={() => { store.deleteElement(el.id); onClose(); }}
          >
            <Trash size={14} /> Delete
          </button>
        </>
      )}
      {!el && (
        <>
          <button className={btn} onClick={() => { store.pasteClipboard(); onClose(); }}>
            <Clipboard size={14} /> Paste
          </button>
          <div className="my-1 h-px bg-neutral-700" />
          <button className={btn} onClick={() => {
            const s = store.getActiveSlide();
            const els = store.editingMode === "mobile" && s?.mobileElements ? s.mobileElements : s?.elements ?? [];
            els.forEach((e) => store.updateElement(e.id, { locked: true }));
            store.pushHistory();
            onClose();
          }}>
            <LockSimple size={14} /> Lock all
          </button>
          <button className={btn} onClick={() => {
            const s = store.getActiveSlide();
            const els = store.editingMode === "mobile" && s?.mobileElements ? s.mobileElements : s?.elements ?? [];
            els.forEach((e) => store.updateElement(e.id, { locked: false }));
            store.pushHistory();
            onClose();
          }}>
            <LockSimpleOpen size={14} /> Unlock all
          </button>
        </>
      )}
    </div>
  );
}
