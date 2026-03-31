"use client";

import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, ElementShadow, TextElement } from "@/types/elements";
import { TextShadowControls } from "./TextShadowControls";
import { BlurControls } from "./BlurControls";

const PRESETS: { label: string; value: ElementShadow | undefined }[] = [
  { label: "None", value: undefined },
  { label: "Soft", value: { offsetX: 0, offsetY: 4, blur: 12, color: "rgba(0,0,0,0.15)" } },
  { label: "Medium", value: { offsetX: 0, offsetY: 8, blur: 24, color: "rgba(0,0,0,0.2)" } },
  { label: "Hard", value: { offsetX: 4, offsetY: 4, blur: 0, color: "rgba(0,0,0,0.25)" } },
  { label: "Glow", value: { offsetX: 0, offsetY: 0, blur: 20, color: "rgba(255,255,255,0.15)" } },
];

export function ShadowControls({ element }: { element: SlideElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const current = element.shadow;
  const activeIdx = current
    ? PRESETS.findIndex((p) => p.value && p.value.blur === current.blur && p.value.offsetY === current.offsetY)
    : 0;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">Box Shadow</span>
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => {
                updateElement(element.id, { shadow: p.value ?? null } as Partial<SlideElement>);
                pushHistory();
              }}
              className={`rounded px-2 py-1 text-[10px] transition-colors ${
                (i === activeIdx || (!current && i === 0))
                  ? "bg-accent text-white"
                  : "text-silver/50 hover:bg-white/5"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {current && (
          <label className="flex items-center gap-2">
            <span className="text-[10px] text-silver/50 shrink-0">Blur</span>
            <input
              type="range"
              min={0} max={50}
              value={current.blur}
              onChange={(e) => {
                updateElement(element.id, { shadow: { ...current, blur: parseInt(e.target.value) } } as Partial<SlideElement>);
                pushHistory();
              }}
              className="flex-1 accent-white"
            />
            <span className="text-[10px] text-silver/40 w-5 text-right">{current.blur}</span>
          </label>
        )}
      </div>
      {element.type === "text" && (
        <TextShadowControls element={element as TextElement} />
      )}
      <BlurControls element={element} />
    </div>
  );
}
