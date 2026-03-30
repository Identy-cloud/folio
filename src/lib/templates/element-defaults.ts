import type { Theme } from "./themes";
import type { TextElement, ShapeElement, ArrowElement, DividerElement, LineElement, TableElement } from "@/types/elements";

type TextDefaults = Pick<TextElement, "fontFamily" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing" | "color" | "textAlign" | "verticalAlign">;
type ShapeDefaults = Pick<ShapeElement, "fill" | "stroke" | "strokeWidth" | "borderRadius">;
type ArrowDefaults = Pick<ArrowElement, "color" | "strokeWidth">;
type DividerDefaults = Pick<DividerElement, "color" | "strokeWidth">;

export function textDefaults(theme: Theme): TextDefaults {
  return {
    fontFamily: theme.fontBody,
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: theme.text,
    textAlign: "left",
    verticalAlign: "top",
  };
}

export function shapeDefaults(theme: Theme): ShapeDefaults {
  return {
    fill: theme.accent,
    stroke: "transparent",
    strokeWidth: 0,
    borderRadius: 0,
  };
}

export function arrowDefaults(theme: Theme): ArrowDefaults {
  return {
    color: theme.text,
    strokeWidth: 3,
  };
}

export function dividerDefaults(theme: Theme): DividerDefaults {
  return {
    color: theme.primary,
    strokeWidth: 2,
  };
}

type TableDefaults = Pick<TableElement, "rows" | "cols" | "cells" | "headerRow" | "borderColor" | "headerBgColor" | "cellPadding" | "fontSize">;

export function tableDefaults(theme: Theme): TableDefaults {
  const rows = 3;
  const cols = 3;
  const cells = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => (r === 0 ? `Header ${c + 1}` : ""))
  );
  return {
    rows,
    cols,
    cells,
    headerRow: true,
    borderColor: theme.text + "33",
    headerBgColor: theme.primary,
    cellPadding: 8,
    fontSize: 16,
  };
}

type LineDefaults = Pick<LineElement, "strokeColor" | "strokeWidth" | "strokeDash" | "arrowStart" | "arrowEnd">;

export function lineDefaults(theme: Theme): LineDefaults {
  return {
    strokeColor: theme.text,
    strokeWidth: 2,
    strokeDash: "solid",
    arrowStart: false,
    arrowEnd: false,
  };
}
