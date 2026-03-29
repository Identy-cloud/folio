"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";

const RECENT_KEY = "folio-recent-colors";
const MAX_RECENT = 8;

function getRecentColors(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}

function addRecentColor(color: string) {
  if (color.startsWith("linear-gradient") || color.startsWith("radial-gradient")) return;
  const recent = getRecentColors().filter((c) => c !== color);
  recent.unshift(color);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

const PRESETS = [
  "#ffffff", "#e5e5e5", "#a3a3a3", "#737373",
  "#404040", "#171717", "#0a0a0a", "#000000",
  "#1a1aff", "#3b82f6", "#06b6d4", "#10b981",
  "#eab308", "#f97316", "#ef4444", "#ec4899",
];

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(180deg, #0a0a0a 0%, #1a1aff 100%)",
  "linear-gradient(135deg, #ff3b00 0%, #eab308 100%)",
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
    const dropW = 192;
    const dropH = 160;
    let top = rect.bottom + 4;
    let left = rect.left;
    if (left + dropW > window.innerWidth - 8) left = window.innerWidth - dropW - 8;
    if (left < 8) left = 8;
    if (top + dropH > window.innerHeight - 8) top = rect.top - dropH - 4;
    setPos({ top, left });
  }, []);

  useClickOutside(dropdownRef, () => setOpen(false), open);

  useEffect(() => {
    if (open) updatePos();
  }, [open, updatePos]);

  const [recentColors, setRecentColors] = useState<string[]>([]);
  useEffect(() => { if (open) setRecentColors(getRecentColors()); }, [open]);

  function applyColor(c: string) {
    onChange(c);
    setHex(c);
    addRecentColor(c);
  }

  function commitHex() {
    const clean = hex.startsWith("#") ? hex : `#${hex}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean)) {
      applyColor(clean);
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
          {recentColors.length > 0 && (
            <div className="mb-1.5">
              <span className="text-[9px] text-neutral-600 uppercase tracking-wider">Recent</span>
              <div className="mt-0.5 flex gap-1">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => applyColor(c)}
                    className={`h-5 w-5 rounded-sm border transition-transform hover:scale-110 ${
                      value === c ? "border-white ring-1 ring-white" : "border-neutral-600"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-8 gap-1 rounded bg-[#2a2a2a] p-1">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => applyColor(c)}
                aria-label={c}
                className={`h-6 w-6 rounded-sm border transition-transform hover:scale-110 ${
                  value === c ? "border-white ring-1 ring-white" : "border-neutral-500"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-8 gap-1 rounded bg-[#2a2a2a] p-1">
            {GRADIENTS.map((g) => (
              <button
                key={g}
                onClick={() => { onChange(g); setHex(g); addRecentColor(g); }}
                aria-label="Gradient"
                className={`h-6 w-6 rounded-sm border transition-transform hover:scale-110 ${
                  value === g ? "border-white ring-1 ring-white" : "border-neutral-500"
                }`}
                style={{ background: g }}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={commitHex}
              onKeyDown={(e) => e.key === "Enter" && commitHex()}
              className="flex-1 rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-[11px] text-neutral-200 outline-none focus:border-neutral-500"
              placeholder="#000000"
            />
            {"EyeDropper" in window && (
              <button
                onClick={async () => {
                  try {
                    const ed = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
                    const result = await ed.open();
                    onChange(result.sRGBHex);
                    setHex(result.sRGBHex);
                  } catch { /* user cancelled */ }
                }}
                className="rounded border border-neutral-700 px-2 py-1 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Pick color from screen"
              >
                💧
              </button>
            )}
          </div>
          {!value.startsWith("linear-gradient") && !value.startsWith("radial-gradient") && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[9px] text-neutral-600">Alpha</span>
              <input
                type="range"
                min={0}
                max={100}
                value={(() => {
                  const m = value.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
                  return m ? Math.round(parseFloat(m[1]) * 100) : 100;
                })()}
                onChange={(e) => {
                  const alpha = parseInt(e.target.value) / 100;
                  const hex6 = value.replace(/^#/, "").replace(/^(.{3})$/, "$1$3");
                  const r = parseInt(hex6.slice(0, 2), 16) || 0;
                  const g = parseInt(hex6.slice(2, 4), 16) || 0;
                  const b = parseInt(hex6.slice(4, 6), 16) || 0;
                  if (alpha >= 1) applyColor(`#${hex6.slice(0, 6)}`);
                  else applyColor(`rgba(${r},${g},${b},${alpha.toFixed(2)})`);
                }}
                className="flex-1 accent-white"
              />
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
