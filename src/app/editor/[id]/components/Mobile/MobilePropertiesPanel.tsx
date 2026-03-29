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
import type { ImageElement, ArrowElement, DividerElement, EmbedElement } from "@/types/elements";

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
      <PositionFields element={el} />
      {el.type === "text" && <TextProperties element={el} />}
      {el.type === "shape" && <ShapeProperties element={el} />}
      {el.type === "image" && <ImageProperties element={el as ImageElement} />}
      {el.type === "arrow" && <ArrowProperties element={el as ArrowElement} />}
      {el.type === "divider" && <DividerProperties element={el as DividerElement} />}
      {el.type === "embed" && <EmbedProperties element={el as EmbedElement} />}
      <AnimationProperties element={el} />
      <AlignControls elementId={el.id} />
      <LayerControls elementId={el.id} />
      <LockToggle element={el} />
      <DeleteButton elementId={el.id} />
    </div>
  );
}
