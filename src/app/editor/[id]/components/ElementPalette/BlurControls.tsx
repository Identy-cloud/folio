"use client";

import { useEditorStore } from "@/store/editorStore";
import type { SlideElement } from "@/types/elements";

export function BlurControls({ element }: { element: SlideElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const blur = element.filterBlur ?? 0;

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Blur Effect</span>
      <label className="flex items-center gap-2">
        <input
          type="range"
          min={0} max={20}
          value={blur}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            updateElement(element.id, { filterBlur: val || undefined } as Partial<SlideElement>);
            pushHistory();
          }}
          className="flex-1 accent-white"
        />
        <span className="text-[10px] text-neutral-600 w-6 text-right">{blur}px</span>
      </label>
    </div>
  );
}
