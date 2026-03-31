"use client";

import { useState } from "react";
import { TransitionIcon, TRANSITION_LIST } from "@/components/editor/TransitionIcons";
import { TransitionPicker } from "./TransitionPicker";
import type { Slide, SlideTransition } from "@/types/elements";

export function InlineTransitionPicker({
  current,
  onChange,
}: {
  current: string;
  onChange: (t: SlideTransition) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center py-1.5">
      {open ? (
        <div className="flex gap-1 rounded-full bg-white/5 px-1.5 py-1">
          {TRANSITION_LIST.map((tr) => (
            <button
              key={tr}
              onClick={() => { onChange(tr); setOpen(false); }}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                current === tr
                  ? "bg-accent text-white"
                  : "text-silver/70 hover:bg-steel hover:text-silver"
              }`}
              title={tr}
            >
              <TransitionIcon type={tr} size={12} />
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex h-6 items-center gap-1.5 rounded-full bg-white/5 px-2.5 text-silver/50 hover:bg-white/5 hover:text-silver transition-colors"
        >
          <TransitionIcon type={current as SlideTransition} size={11} />
          <span className="text-[9px] uppercase tracking-wider opacity-60 group-hover:opacity-100">
            {current === "none" ? "—" : current}
          </span>
        </button>
      )}
    </div>
  );
}

interface ContextMenuData {
  x: number;
  y: number;
  slideId: string;
}

interface SlideContextMenuProps {
  menu: ContextMenuData;
  slides: Slide[];
  onDuplicate: (id: string) => void;
  onMoveToStart: (id: string) => void;
  onMoveToEnd: (id: string) => void;
  onAddSlide: () => void;
  onDelete: (id: string) => void;
  onTransition: (id: string, tr: SlideTransition) => void;
  onSaveToLibrary?: (id: string) => void;
  onImportSlide?: () => void;
  onClose: () => void;
  labels: { duplicate: string; moveToStart: string; moveToEnd: string; delete: string };
}

export function SlideContextMenu({
  menu, slides, onDuplicate, onMoveToStart, onMoveToEnd,
  onAddSlide, onDelete, onTransition, onSaveToLibrary, onImportSlide, onClose, labels,
}: SlideContextMenuProps) {
  return (
    <div
      className="fixed z-50 w-44 rounded border border-steel bg-steel py-1 shadow-lg"
      style={{ left: menu.x, top: menu.y }}
    >
      <CtxItem label={labels.duplicate} onClick={() => { onDuplicate(menu.slideId); onClose(); }} />
      <CtxItem label={labels.moveToStart} onClick={() => { onMoveToStart(menu.slideId); onClose(); }} />
      <CtxItem label={labels.moveToEnd} onClick={() => { onMoveToEnd(menu.slideId); onClose(); }} />
      <CtxItem label="Add slide after" onClick={() => { onAddSlide(); onClose(); }} />
      {onImportSlide && <CtxItem label="Import slide from..." onClick={() => { onImportSlide(); onClose(); }} />}
      {onSaveToLibrary && <CtxItem label="Save to library" onClick={() => { onSaveToLibrary(menu.slideId); onClose(); }} />}
      <div className="border-t border-steel">
        <TransitionPicker
          current={slides.find((s) => s.id === menu.slideId)?.transition ?? "fade"}
          onChange={(tr) => onTransition(menu.slideId, tr)}
        />
      </div>
      {slides.length > 1 && (
        <CtxItem label={labels.delete} destructive onClick={() => { onDelete(menu.slideId); onClose(); }} />
      )}
    </div>
  );
}

export function CtxItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-xs hover:bg-white/5 ${
        destructive ? "text-red-500" : "text-silver"
      }`}
    >
      {label}
    </button>
  );
}
