"use client";

import { memo, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { TableElement } from "@/types/elements";

interface Props {
  element: TableElement;
  editable?: boolean;
}

export const TableRenderer = memo(function TableRenderer({ element, editable = false }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const handleCellBlur = useCallback(
    (row: number, col: number, value: string) => {
      const newCells = element.cells.map((r) => [...r]);
      newCells[row][col] = value;
      updateElement(element.id, { cells: newCells });
      pushHistory();
    },
    [element.id, element.cells, updateElement, pushHistory]
  );

  return (
    <div className="h-full w-full overflow-auto">
      <table
        style={{
          width: "100%",
          height: "100%",
          borderCollapse: "collapse",
          fontSize: element.fontSize,
          tableLayout: "fixed",
        }}
      >
        <tbody>
          {element.cells.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <TableCell
                  key={`${ri}-${ci}`}
                  value={cell}
                  isHeader={element.headerRow && ri === 0}
                  borderColor={element.borderColor}
                  headerBgColor={element.headerBgColor}
                  cellPadding={element.cellPadding}
                  editable={editable}
                  onBlur={(v) => handleCellBlur(ri, ci, v)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

interface CellProps {
  value: string;
  isHeader: boolean;
  borderColor: string;
  headerBgColor: string;
  cellPadding: number;
  editable: boolean;
  onBlur: (value: string) => void;
}

const TableCell = memo(function TableCell({
  value,
  isHeader,
  borderColor,
  headerBgColor,
  cellPadding,
  editable,
  onBlur,
}: CellProps) {
  const style: React.CSSProperties = {
    border: `1px solid ${borderColor}`,
    padding: cellPadding,
    backgroundColor: isHeader ? headerBgColor : "transparent",
    color: isHeader ? "#ffffff" : "inherit",
    fontWeight: isHeader ? 600 : 400,
    verticalAlign: "middle",
    outline: "none",
    wordBreak: "break-word",
    minWidth: 40,
  };

  return (
    <td
      contentEditable={editable}
      suppressContentEditableWarning
      style={style}
      onBlur={(e) => onBlur(e.currentTarget.textContent ?? "")}
      onPointerDown={(e) => {
        if (editable) e.stopPropagation();
      }}
    >
      {value}
    </td>
  );
});
