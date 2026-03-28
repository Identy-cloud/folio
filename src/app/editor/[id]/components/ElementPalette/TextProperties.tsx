"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { ALL_FONTS } from "@/lib/templates/themes";
import { TextAlignLeft, TextAlignCenter, TextAlignRight } from "@phosphor-icons/react";
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
      >
        {ALL_FONTS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
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

      {/* Weight + Align */}
      <div className="flex gap-2">
        <div className="flex gap-1">
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
        </div>
        <div className="ml-auto flex gap-0.5">
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
      </div>

      {/* Color */}
      <ColorPicker label={t.editor.color} value={element.color} onChange={(c) => update({ color: c })} />
    </div>
  );
}
