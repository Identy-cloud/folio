"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { PositionFields } from "../ElementPalette/PositionFields";
import { TextProperties } from "../ElementPalette/TextProperties";
import { ShapeProperties } from "../ElementPalette/ShapeProperties";
import { ImageProperties } from "../ElementPalette/ImageProperties";
import { ArrowProperties } from "../ElementPalette/ArrowProperties";
import { DividerProperties } from "../ElementPalette/DividerProperties";
import { AnimationProperties } from "../ElementPalette/AnimationProperties";
import { AlignControls } from "../ElementPalette/AlignControls";
import { LayerControls } from "../ElementPalette/LayerControls";
import { LockToggle } from "../ElementPalette/LockToggle";
import { DeleteButton } from "../ElementPalette/DeleteButton";
import { EmbedProperties } from "../ElementPalette/EmbedProperties";
import { LineProperties } from "../ElementPalette/LineProperties";
import { TableProperties } from "../ElementPalette/TableProperties";
import { VideoProperties } from "../ElementPalette/VideoProperties";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import type { ImageElement, ArrowElement, DividerElement, EmbedElement, LineElement, TableElement, VideoElement } from "@/types/elements";

export function MobilePropertiesPanel({ onClose }: { onClose: () => void }) {
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const editingMode = useEditorStore((s) => s.editingMode);

  const elements = editingMode === "mobile" && activeSlide?.mobileElements
    ? activeSlide.mobileElements
    : activeSlide?.elements;
  const el = elements?.find((e) => selectedIds.includes(e.id));

  useEffect(() => {
    if (!el) onClose();
  }, [el, onClose]);

  if (!el) return null;

  return (
    <div className="p-4 space-y-4">
      <CollapsibleSection title="Position" defaultOpen>
        <PositionFields element={el} />
      </CollapsibleSection>
      <CollapsibleSection title={el.type} defaultOpen>
        {el.type === "text" && <TextProperties element={el} />}
        {el.type === "shape" && <ShapeProperties element={el} />}
        {el.type === "image" && <ImageProperties element={el as ImageElement} />}
        {el.type === "arrow" && <ArrowProperties element={el as ArrowElement} />}
        {el.type === "divider" && <DividerProperties element={el as DividerElement} />}
        {el.type === "embed" && <EmbedProperties element={el as EmbedElement} />}
        {el.type === "line" && <LineProperties element={el as LineElement} />}
        {el.type === "table" && <TableProperties element={el as TableElement} />}
        {el.type === "video" && <VideoProperties element={el as VideoElement} />}
      </CollapsibleSection>
      <CollapsibleSection title="Animation" defaultOpen={false}>
        <AnimationProperties element={el} />
      </CollapsibleSection>
      <CollapsibleSection title="Align" defaultOpen={false}>
        <AlignControls elementId={el.id} />
      </CollapsibleSection>
      <CollapsibleSection title="Layers" defaultOpen={false}>
        <LayerControls elementId={el.id} />
      </CollapsibleSection>
      <LockToggle element={el} />
      <DeleteButton elementId={el.id} />
    </div>
  );
}
