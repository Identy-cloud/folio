"use client";

import { useState, useRef, useEffect } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setHex(value), [value]);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function commitHex() {
    const clean = hex.startsWith("#") ? hex : `#${hex}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
      onChange(clean);
    }
  }

  return (
    <div ref={ref} className="relative">
      {label && (
        <span className="mb-1 block text-[10px] text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-full items-center gap-2 rounded border border-neutral-700 px-2 hover:border-neutral-600"
      >
        <span
          className="h-4 w-4 rounded-sm border border-neutral-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-[11px] text-neutral-400">{value}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded border border-neutral-700 bg-[#1e1e1e] p-2 shadow-xl">
          <div className="grid grid-cols-8 gap-1">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setHex(c); }}
                className={`h-5 w-5 rounded-sm border transition-transform hover:scale-110 ${
                  value === c ? "border-white" : "border-neutral-700"
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
        </div>
      )}
    </div>
  );
}
