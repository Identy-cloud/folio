import type { Theme } from "./themes";
import type { TextElement, ShapeElement, ArrowElement, DividerElement } from "@/types/elements";

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
