"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, FlipHorizontal, FlipVertical, Crop } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useImageReplace } from "../../hooks/useImageReplace";
import { useTranslation } from "@/lib/i18n/context";
import type { ImageElement } from "@/types/elements";

const FILTERS = [
  { value: "", label: "None" },
  { value: "grayscale(100%)", label: "B&W" },
  { value: "sepia(80%)", label: "Sepia" },
  { value: "brightness(1.2)", label: "Bright" },
  { value: "contrast(1.3)", label: "Contrast" },
  { value: "saturate(1.5)", label: "Vivid" },
  { value: "saturate(0.3)", label: "Muted" },
  { value: "blur(2px)", label: "Blur" },
  { value: "brightness(0.6) contrast(1.2)", label: "Dark" },
];

interface Props {
  element: ImageElement;
}

export function ImageProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const { trigger, uploading } = useImageReplace(element.id);

  useEffect(() => {
    function onReplace(e: Event) {
      if ((e as CustomEvent).detail === element.id) trigger();
    }
    window.addEventListener("folio:replace-image", onReplace);
    return () => window.removeEventListener("folio:replace-image", onReplace);
  }, [element.id, trigger]);

  function setObjectFit(value: "cover" | "contain" | "fill") {
    updateElement(element.id, { objectFit: value });
    pushHistory();
  }

  const fits: { value: "cover" | "contain" | "fill"; label: string }[] = [
    { value: "cover", label: t.editor.fitCover },
    { value: "contain", label: t.editor.fitContain },
    { value: "fill", label: t.editor.fitFill },
  ];

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">
        {t.editor.image}
      </span>

      <button
        onClick={trigger}
        disabled={uploading}
        className="flex w-full items-center gap-2 rounded border border-steel px-3 py-2 text-xs text-silver hover:bg-white/5 disabled:opacity-50"
      >
        <ImageIcon size={14} weight="regular" />
        {uploading ? t.editor.uploading : t.editor.changeImage}
      </button>

      <div className="flex gap-1">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("folio:crop-image", { detail: element.id }))}
          className="flex flex-1 items-center justify-center gap-1 rounded border border-steel px-3 py-2 text-xs text-silver hover:bg-white/5"
        >
          <Crop size={14} weight="regular" /> Crop
        </button>
        {element.cropWidth !== undefined && element.cropWidth < 1 && (
          <button
            onClick={() => {
              updateElement(element.id, { cropX: 0, cropY: 0, cropWidth: 1, cropHeight: 1 });
              pushHistory();
            }}
            className="rounded border border-steel px-2 py-2 text-[10px] text-silver/50 hover:bg-white/5 hover:text-silver"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex gap-1">
        {fits.map((f) => (
          <button
            key={f.value}
            onClick={() => setObjectFit(f.value)}
            className={`flex-1 rounded px-2 py-1 text-[10px] ${
              element.objectFit === f.value
                ? "bg-steel text-white"
                : "text-silver/70 hover:bg-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Border radius */}
      <label className="flex items-center gap-2">
        <span className="text-[10px] text-silver/50 shrink-0">Radius</span>
        <input
          type="range"
          min={0}
          max={50}
          value={element.borderRadius ?? 0}
          onChange={(e) => { updateElement(element.id, { borderRadius: parseInt(e.target.value) }); pushHistory(); }}
          className="flex-1 accent-white"
        />
        <span className="text-[10px] text-silver/40 w-6 text-right">{element.borderRadius ?? 0}</span>
      </label>

      {/* Flip */}
      <div className="flex gap-1">
        <button
          onClick={() => { updateElement(element.id, { flipX: !element.flipX }); pushHistory(); }}
          className={`flex-1 flex items-center justify-center gap-1 rounded py-1 text-[10px] transition-colors ${
            element.flipX ? "bg-accent text-white" : "text-silver/50 hover:bg-white/5"
          }`}
        >
          <FlipHorizontal size={14} /> Flip H
        </button>
        <button
          onClick={() => { updateElement(element.id, { flipY: !element.flipY }); pushHistory(); }}
          className={`flex-1 flex items-center justify-center gap-1 rounded py-1 text-[10px] transition-colors ${
            element.flipY ? "bg-accent text-white" : "text-silver/50 hover:bg-white/5"
          }`}
        >
          <FlipVertical size={14} /> Flip V
        </button>
      </div>

      {/* Filters */}
      <div>
        <span className="mb-1 block text-[10px] text-silver/50">Filter</span>
        <div className="grid grid-cols-3 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                updateElement(element.id, { filter: f.value });
                pushHistory();
              }}
              className={`rounded px-1.5 py-1 text-[10px] transition-colors ${
                (element.filter || "") === f.value
                  ? "bg-accent text-white"
                  : "text-silver/50 hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
