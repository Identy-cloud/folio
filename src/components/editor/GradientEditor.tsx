"use client";

import { useState } from "react";
import type { GradientDef } from "@/types/elements";
import { gradientToCSS, GRADIENT_PRESETS } from "@/lib/gradient-utils";

interface Props {
  value: GradientDef | null;
  onChange: (gradient: GradientDef) => void;
}

const DEFAULT: GradientDef = { type: "linear", angle: 135, stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] };

export function GradientEditor({ value, onChange }: Props) {
  const g = value ?? DEFAULT;
  const [editIdx, setEditIdx] = useState(0);
  const [stopHex, setStopHex] = useState(g.stops[0]?.color ?? "#000000");

  function updateStop(i: number, patch: Partial<{ color: string; position: number }>) {
    onChange({ ...g, stops: g.stops.map((s, j) => j === i ? { ...s, ...patch } : s) });
  }
  function addStop() {
    if (g.stops.length >= 4) return;
    onChange({ ...g, stops: [...g.stops, { color: "#888888", position: 50 }].sort((a, b) => a.position - b.position) });
  }
  function removeStop(i: number) {
    if (g.stops.length <= 2) return;
    onChange({ ...g, stops: g.stops.filter((_, j) => j !== i) });
  }
  function commitHex() {
    const c = stopHex.startsWith("#") ? stopHex : `#${stopHex}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c)) updateStop(editIdx, { color: c });
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-1">
        {GRADIENT_PRESETS.map((p, i) => (
          <button key={i} onClick={() => { onChange(p); setStopHex(p.stops[0]?.color ?? "#000"); setEditIdx(0); }}
            className="h-6 w-full rounded-sm border border-neutral-600 transition-transform hover:scale-105"
            style={{ background: gradientToCSS(p) }} title={`${p.type} gradient`} />
        ))}
      </div>
      <div className="h-6 w-full rounded border border-neutral-600" style={{ background: gradientToCSS(g) }} />
      <div className="flex gap-1.5 items-center">
        <select value={g.type} onChange={(e) => onChange({ ...g, type: e.target.value as "linear" | "radial" })}
          className="rounded border border-neutral-700 bg-[#161616] px-1.5 py-1 text-[10px] text-neutral-300 outline-none">
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
        {g.type === "linear" && (
          <label className="flex items-center gap-1 flex-1">
            <span className="text-[9px] text-neutral-500">Angle</span>
            <input type="range" min={0} max={360} value={g.angle ?? 135}
              onChange={(e) => onChange({ ...g, angle: parseInt(e.target.value) })} className="flex-1 accent-white" />
            <span className="text-[9px] text-neutral-500 w-6 text-right">{g.angle ?? 135}</span>
          </label>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-neutral-500 uppercase tracking-wider">Stops</span>
          {g.stops.length < 4 && (
            <button onClick={addStop} className="text-[9px] text-neutral-500 hover:text-white transition-colors">+ Add</button>
          )}
        </div>
        {g.stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-1">
            <button onClick={() => { setEditIdx(i); setStopHex(stop.color); }}
              className={`h-5 w-5 shrink-0 rounded-sm border transition-transform hover:scale-110 ${editIdx === i ? "border-white ring-1 ring-white" : "border-neutral-600"}`}
              style={{ backgroundColor: stop.color }} />
            <input type="range" min={0} max={100} value={stop.position}
              onChange={(e) => updateStop(i, { position: parseInt(e.target.value) })} className="flex-1 accent-white" />
            <span className="text-[9px] text-neutral-500 w-6 text-right">{stop.position}</span>
            {g.stops.length > 2 && (
              <button onClick={() => removeStop(i)} className="text-[9px] text-neutral-600 hover:text-red-400 transition-colors">x</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input value={stopHex} onChange={(e) => setStopHex(e.target.value)} onBlur={commitHex}
          onKeyDown={(e) => e.key === "Enter" && commitHex()}
          className="flex-1 rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-[10px] text-neutral-200 outline-none focus:border-neutral-500"
          placeholder="#000000" />
      </div>
    </div>
  );
}
