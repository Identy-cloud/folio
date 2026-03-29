"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { ALL_FONTS } from "@/lib/templates/themes";
import { TextAlignLeft, TextAlignCenter, TextAlignRight, TextItalic, TextUnderline, TextStrikethrough, ArrowLineUp, ArrowsVertical, ArrowLineDown } from "@phosphor-icons/react";
import type { TextElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

const SIZES = [12, 16, 24, 32, 48, 72, 96, 120];

interface Props { element: TextElement }

export function TextProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [sizeInput, setSizeInput] = useState(String(element.fontSize));

  const WEIGHTS = [
    { value: 400, label: t.editor.fontWeight.regular },
    { value: 600, label: t.editor.fontWeight.semi },
    { value: 700, label: t.editor.fontWeight.bold },
  ];

  useEffect(() => setSizeInput(String(element.fontSize)), [element.fontSize]);

  function update(u: Partial<TextElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  function commitSize() {
    const n = parseInt(sizeInput, 10);
    if (n > 0 && n <= 500) update({ fontSize: n });
  }

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{t.editor.text}</span>

      {/* Font family */}
      <select
        value={element.fontFamily}
        onChange={(e) => update({ fontFamily: e.target.value })}
        className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-200 outline-none"
        style={{ fontFamily: element.fontFamily }}
      >
        {ALL_FONTS.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
        ))}
      </select>

      {/* Font size */}
      <div>
        <span className="mb-1 block text-[10px] text-neutral-500">{t.editor.fontSize}</span>
        <div className="flex gap-1">
          <input
            type="number"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onBlur={commitSize}
            onKeyDown={(e) => e.key === "Enter" && commitSize()}
            className="w-16 rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500"
          />
          <div className="flex flex-wrap gap-1">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => { update({ fontSize: s }); setSizeInput(String(s)); }}
                className={`rounded px-1.5 py-0.5 text-[10px] transition-colors ${
                  element.fontSize === s
                    ? "bg-white text-[#161616]"
                    : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weight + Style */}
      <div className="flex flex-wrap gap-1">
        {WEIGHTS.map((w) => (
          <button
            key={w.value}
            onClick={() => update({ fontWeight: w.value })}
            className={`rounded px-2 py-1 text-[10px] transition-colors ${
              element.fontWeight === w.value
                ? "bg-white text-[#161616]"
                : "text-neutral-500 hover:bg-neutral-800"
            }`}
          >
            {w.label}
          </button>
        ))}
        <button
          onClick={() => update({ fontStyle: element.fontStyle === "italic" ? "normal" : "italic" })}
          className={`rounded p-1 transition-colors ${
            element.fontStyle === "italic"
              ? "bg-white text-[#161616]"
              : "text-neutral-500 hover:bg-neutral-800"
          }`}
          aria-label="Italic"
        >
          <TextItalic size={14} />
        </button>
        <button
          onClick={() => update({ textDecoration: element.textDecoration === "underline" ? "none" : "underline" })}
          className={`rounded p-1 transition-colors ${
            element.textDecoration === "underline"
              ? "bg-white text-[#161616]"
              : "text-neutral-500 hover:bg-neutral-800"
          }`}
          aria-label="Underline"
        >
          <TextUnderline size={14} />
        </button>
        <button
          onClick={() => update({ textDecoration: element.textDecoration === "line-through" ? "none" : "line-through" })}
          className={`rounded p-1 transition-colors ${
            element.textDecoration === "line-through"
              ? "bg-white text-[#161616]"
              : "text-neutral-500 hover:bg-neutral-800"
          }`}
          aria-label="Strikethrough"
        >
          <TextStrikethrough size={14} />
        </button>
      </div>

      {/* Align horizontal + vertical */}
      <div className="flex gap-2">
        <div className="flex gap-0.5">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => update({ textAlign: a })}
              className={`rounded p-1 transition-colors ${
                element.textAlign === a
                  ? "bg-white text-[#161616]"
                  : "text-neutral-500 hover:bg-neutral-800"
              }`}
            >
              {a === "left" && <TextAlignLeft size={14} />}
              {a === "center" && <TextAlignCenter size={14} />}
              {a === "right" && <TextAlignRight size={14} />}
            </button>
          ))}
        </div>
        <div className="w-px bg-neutral-700" />
        <div className="flex gap-0.5">
          {(["top", "middle", "bottom"] as const).map((v) => (
            <button
              key={v}
              onClick={() => update({ verticalAlign: v })}
              className={`rounded p-1 transition-colors ${
                element.verticalAlign === v
                  ? "bg-white text-[#161616]"
                  : "text-neutral-500 hover:bg-neutral-800"
              }`}
              aria-label={`Align ${v}`}
            >
              {v === "top" && <ArrowLineUp size={14} />}
              {v === "middle" && <ArrowsVertical size={14} />}
              {v === "bottom" && <ArrowLineDown size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Line height + Letter spacing */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">Line height</span>
          <input
            type="range"
            min={0.8}
            max={3}
            step={0.1}
            value={element.lineHeight}
            onChange={(e) => update({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-white"
          />
          <span className="text-[9px] text-neutral-600 text-center">{element.lineHeight.toFixed(1)}</span>
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">Spacing</span>
          <input
            type="range"
            min={-0.1}
            max={0.3}
            step={0.01}
            value={element.letterSpacing}
            onChange={(e) => update({ letterSpacing: parseFloat(e.target.value) })}
            className="w-full accent-white"
          />
          <span className="text-[9px] text-neutral-600 text-center">{element.letterSpacing.toFixed(2)}em</span>
        </label>
      </div>

      {/* Color */}
      <ColorPicker label={t.editor.color} value={element.color} onChange={(c) => update({ color: c })} />

      {/* Text stroke */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-500">Text outline</span>
          <button
            onClick={() => update({ textStroke: element.textStroke ? undefined : { width: 1, color: "#000000" } })}
            className={`rounded px-2 py-0.5 text-[10px] transition-colors ${element.textStroke ? "bg-white text-[#161616]" : "text-neutral-500 hover:bg-neutral-800"}`}
          >
            {element.textStroke ? "On" : "Off"}
          </button>
        </div>
        {element.textStroke && (
          <div className="mt-1.5 flex gap-2">
            <label className="flex items-center gap-1 flex-1">
              <span className="text-[9px] text-neutral-600">W</span>
              <input
                type="number"
                min={0.5}
                max={5}
                step={0.5}
                value={element.textStroke.width}
                onChange={(e) => update({ textStroke: { ...element.textStroke!, width: parseFloat(e.target.value) || 1 } })}
                className="w-12 rounded border border-neutral-700 bg-[#161616] px-1.5 py-0.5 text-[10px] text-neutral-300 outline-none"
              />
            </label>
            <ColorPicker value={element.textStroke.color} onChange={(c) => update({ textStroke: { ...element.textStroke!, color: c } })} />
          </div>
        )}
      </div>
    </div>
  );
}
