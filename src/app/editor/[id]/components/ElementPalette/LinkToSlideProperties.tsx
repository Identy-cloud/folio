"use client";

import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, TextElement } from "@/types/elements";

function getSlideLabel(index: number, elements: SlideElement[]): string {
  const textEl = elements.find(
    (el): el is TextElement => el.type === "text" && el.fontSize >= 32
  );
  const preview = textEl
    ? textEl.content.replace(/<[^>]*>/g, "").slice(0, 24)
    : "";
  return preview ? `${index + 1}. ${preview}` : `Slide ${index + 1}`;
}

interface Props {
  element: SlideElement;
}

export function LinkToSlideProperties({ element }: Props) {
  const slides = useEditorStore((s) => s.slides);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const currentValue = element.linkSlideIndex;

  function handleChange(value: string) {
    if (value === "") {
      updateElement(element.id, { linkSlideIndex: undefined } as Partial<SlideElement>);
    } else {
      updateElement(element.id, { linkSlideIndex: parseInt(value, 10) } as Partial<SlideElement>);
    }
    pushHistory();
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-neutral-500">Link to slide</label>
      <select
        value={currentValue !== undefined ? String(currentValue) : ""}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border border-neutral-700 bg-[#111] px-2 py-1.5 text-xs text-neutral-300 outline-none focus:border-neutral-500"
      >
        <option value="">None</option>
        {slides.map((slide, i) => (
          <option key={slide.id} value={String(i)}>
            {getSlideLabel(i, slide.elements)}
          </option>
        ))}
      </select>
      {currentValue !== undefined && (
        <button
          onClick={() => handleChange("")}
          className="w-full rounded border border-neutral-700 px-2 py-1.5 text-[10px] text-red-400 hover:bg-neutral-800 transition-colors"
        >
          Clear link
        </button>
      )}
    </div>
  );
}
