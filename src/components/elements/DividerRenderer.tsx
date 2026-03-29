import { memo } from "react";
import type { DividerElement } from "@/types/elements";

const BORDER_STYLE: Record<string, string> = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
};

export const DividerRenderer = memo(function DividerRenderer({ element }: { element: DividerElement }) {
  const style = BORDER_STYLE[element.dashPattern ?? "solid"];
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "100%",
          height: 0,
          borderTopWidth: element.strokeWidth,
          borderTopStyle: style as "solid" | "dashed" | "dotted",
          borderTopColor: element.color,
        }}
      />
    </div>
  );
});
