"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { GradientEditor } from "./GradientEditor";
import { SolidColorPanel, addRecentColor } from "./SolidColorPanel";
import { gradientToCSS } from "@/lib/gradient-utils";
import type { GradientDef } from "@/types/elements";

interface Props {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  gradient?: GradientDef | null;
  onGradientChange?: (gradient: GradientDef | null) => void;
}

export function ColorPicker({ value, onChange, label, gradient, onGradientChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const [tab, setTab] = useState<"solid" | "gradient">(gradient ? "gradient" : "solid");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHex(value), [value]);
  useEffect(() => { if (gradient) setTab("gradient"); }, [gradient]);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = rect.bottom + 4;
    let left = rect.left;
    if (left + 220 > window.innerWidth - 8) left = window.innerWidth - 228;
    if (left < 8) left = 8;
    if (top + 200 > window.innerHeight - 8) top = rect.top - 204;
    setPos({ top, left });
  }, []);

  useClickOutside(dropdownRef, () => setOpen(false), open);
  useEffect(() => { if (open) updatePos(); }, [open, updatePos]);

  function applyColor(c: string) {
    onChange(c); setHex(c); addRecentColor(c); onGradientChange?.(null);
  }

  function commitHex() {
    const clean = hex.startsWith("#") ? hex : `#${hex}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) applyColor(clean);
  }

  const showGradientTab = !!onGradientChange;
  const hasGrad = !!gradient && gradient.stops.length >= 2;
  const previewBg = hasGrad ? gradientToCSS(gradient) : value;
  const previewLabel = hasGrad ? `${gradient.type} gradient` : value;

  return (
    <div>
      {label && <span className="mb-1 block text-[10px] text-silver/50 uppercase tracking-wider">{label}</span>}
      <button ref={triggerRef} onClick={() => setOpen(!open)}
        className="flex h-7 w-full items-center gap-2 rounded border border-steel px-2 hover:border-silver/40">
        <span className="h-4 w-4 rounded-sm border border-steel/60" style={{ background: previewBg }} />
        <span className="text-[11px] text-silver/70 truncate">{previewLabel}</span>
      </button>

      {open && pos && createPortal(
        <div ref={dropdownRef} style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
          className="w-55 rounded border border-steel bg-slate p-2 shadow-xl">
          {showGradientTab && (
            <div className="mb-2 flex rounded bg-steel p-0.5">
              <button onClick={() => setTab("solid")}
                className={`flex-1 rounded px-2 py-1 text-[10px] transition-colors ${tab === "solid" ? "bg-steel text-white" : "text-silver/50 hover:text-silver"}`}>
                Solid</button>
              <button onClick={() => setTab("gradient")}
                className={`flex-1 rounded px-2 py-1 text-[10px] transition-colors ${tab === "gradient" ? "bg-steel text-white" : "text-silver/50 hover:text-silver"}`}>
                Gradient</button>
            </div>
          )}
          {tab === "gradient" && showGradientTab ? (
            <GradientEditor value={gradient ?? null} onChange={onGradientChange} />
          ) : (
            <SolidColorPanel value={value} hex={hex} setHex={setHex}
              applyColor={applyColor} commitHex={commitHex} hasGradient={hasGrad} />
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
