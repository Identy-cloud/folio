"use client";

import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, ElementShadow, TextElement } from "@/types/elements";

export function TextShadowControls({ element }: { element: TextElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const ts = element.textShadow;
  const enabled = !!ts;

  function toggle() {
    const value = enabled ? undefined : { offsetX: 2, offsetY: 2, blur: 4, color: "rgba(0,0,0,0.3)" };
    updateElement(element.id, { textShadow: value } as Partial<SlideElement>);
    pushHistory();
  }

  function update(patch: Partial<ElementShadow>) {
    if (!ts) return;
    updateElement(element.id, { textShadow: { ...ts, ...patch } } as Partial<SlideElement>);
    pushHistory();
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Text Shadow</span>
        <button onClick={toggle} className={`rounded px-2 py-0.5 text-[10px] transition-colors ${enabled ? "bg-white text-[#161616]" : "text-neutral-500 hover:bg-neutral-800"}`}>
          {enabled ? "On" : "Off"}
        </button>
      </div>
      {ts && (
        <div className="space-y-1">
          {(["offsetX", "offsetY", "blur"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 w-10 shrink-0">
                {key === "offsetX" ? "X" : key === "offsetY" ? "Y" : "Blur"}
              </span>
              <input
                type="range"
                min={key === "blur" ? 0 : -20} max={key === "blur" ? 40 : 20}
                value={ts[key]}
                onChange={(e) => update({ [key]: parseInt(e.target.value) })}
                className="flex-1 accent-white"
              />
              <span className="text-[10px] text-neutral-600 w-5 text-right">{ts[key]}</span>
            </label>
          ))}
          <label className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 w-10 shrink-0">Color</span>
            <input
              type="color"
              value={ts.color.startsWith("rgba") ? "#000000" : ts.color}
              onChange={(e) => update({ color: e.target.value })}
              className="h-5 w-8 cursor-pointer rounded border border-neutral-700 bg-transparent"
            />
            <span className="text-[10px] text-neutral-600 truncate flex-1">{ts.color}</span>
          </label>
        </div>
      )}
    </div>
  );
}
