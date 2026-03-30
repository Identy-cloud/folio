"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { TableElement } from "@/types/elements";

interface Props {
  element: TableElement;
}

export function TableProperties({ element }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [fontSize, setFontSize] = useState(String(element.fontSize));
  const [padding, setPadding] = useState(String(element.cellPadding));

  useEffect(() => setFontSize(String(element.fontSize)), [element.fontSize]);
  useEffect(() => setPadding(String(element.cellPadding)), [element.cellPadding]);

  function update(u: Partial<TableElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  function resizeCells(newRows: number, newCols: number) {
    const cells: string[][] = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) =>
        r < element.cells.length && c < (element.cells[r]?.length ?? 0)
          ? element.cells[r][c]
          : ""
      )
    );
    update({ rows: newRows, cols: newCols, cells });
  }

  const numInput =
    "w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-neutral-500";

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        Table
      </span>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">Rows</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { if (element.rows > 1) resizeCells(element.rows - 1, element.cols); }}
              className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400 hover:bg-neutral-800"
            >
              -
            </button>
            <span className="flex-1 text-center text-xs text-neutral-200">{element.rows}</span>
            <button
              onClick={() => { if (element.rows < 20) resizeCells(element.rows + 1, element.cols); }}
              className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400 hover:bg-neutral-800"
            >
              +
            </button>
          </div>
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-500">Columns</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { if (element.cols > 1) resizeCells(element.rows, element.cols - 1); }}
              className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400 hover:bg-neutral-800"
            >
              -
            </button>
            <span className="flex-1 text-center text-xs text-neutral-200">{element.cols}</span>
            <button
              onClick={() => { if (element.cols < 10) resizeCells(element.rows, element.cols + 1); }}
              className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs text-neutral-400 hover:bg-neutral-800"
            >
              +
            </button>
          </div>
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={element.headerRow}
          onChange={(e) => update({ headerRow: e.target.checked })}
          className="accent-blue-500"
        />
        <span className="text-[10px] text-neutral-400">Header row</span>
      </label>

      <ColorPicker
        label="Border color"
        value={element.borderColor}
        onChange={(c) => update({ borderColor: c })}
      />

      {element.headerRow && (
        <ColorPicker
          label="Header background"
          value={element.headerBgColor}
          onChange={(c) => update({ headerBgColor: c })}
        />
      )}

      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">Font size</span>
        <input
          type="number"
          min={8}
          max={72}
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          onBlur={() => {
            const n = parseInt(fontSize, 10);
            if (!isNaN(n)) update({ fontSize: n });
          }}
          className={numInput}
        />
      </label>

      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">Cell padding</span>
        <input
          type="number"
          min={0}
          max={32}
          value={padding}
          onChange={(e) => setPadding(e.target.value)}
          onBlur={() => {
            const n = parseInt(padding, 10);
            if (!isNaN(n)) update({ cellPadding: n });
          }}
          className={numInput}
        />
      </label>
    </div>
  );
}
