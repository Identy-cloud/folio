"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const PRESETS = [
  "#ffffff", "#e5e5e5", "#a3a3a3", "#737373",
  "#404040", "#171717", "#0a0a0a", "#000000",
  "#1a1aff", "#3b82f6", "#06b6d4", "#10b981",
  "#eab308", "#f97316", "#ef4444", "#ec4899",
];

interface Props {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHex(value), [value]);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    function close(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, updatePos]);

  function commitHex() {
    const clean = hex.startsWith("#") ? hex : `#${hex}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
      onChange(clean);
    }
  }

  return (
    <div>
      {label && (
        <span className="mb-1 block text-[10px] text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="flex h-7 w-full items-center gap-2 rounded border border-neutral-700 px-2 hover:border-neutral-600"
      >
        <span
          className="h-4 w-4 rounded-sm border border-neutral-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-[11px] text-neutral-400">{value}</span>
      </button>

      {open && pos && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
          className="w-48 rounded border border-neutral-700 bg-[#1e1e1e] p-2 shadow-xl"
        >
          <div className="grid grid-cols-8 gap-1 rounded bg-[#2a2a2a] p-1">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setHex(c); }}
                aria-label={c}
                className={`h-5 w-5 rounded-sm border transition-transform hover:scale-110 ${
                  value === c ? "border-white ring-1 ring-white" : "border-neutral-500"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={commitHex}
              onKeyDown={(e) => e.key === "Enter" && commitHex()}
              className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-[11px] text-neutral-200 outline-none focus:border-neutral-500"
              placeholder="#000000"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
