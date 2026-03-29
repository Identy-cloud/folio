import { memo } from "react";
import type { DividerElement } from "@/types/elements";

export const DividerRenderer = memo(function DividerRenderer({ element }: { element: DividerElement }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: element.strokeWidth, backgroundColor: element.color }} />
    </div>
  );
});
