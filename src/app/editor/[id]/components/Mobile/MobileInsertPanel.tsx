"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { TextT, Rectangle, Circle, Triangle, Image as ImageIcon, Diamond, Star, ArrowRight, Minus, LineSegment, GridNine, Smiley, VideoCamera, ImageSquare } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { textDefaults, shapeDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useTranslation } from "@/lib/i18n/context";
import { IconPicker } from "../IconPicker";
import { UnsplashPicker } from "../UnsplashPicker";
import type { TextElement, ShapeElement, ArrowElement, DividerElement, LineElement, TableElement, VideoElement } from "@/types/elements";
import { arrowDefaults, dividerDefaults, lineDefaults, tableDefaults, videoDefaults } from "@/lib/templates/element-defaults";

export function MobileInsertPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const theme = useEditorStore((s) => THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const { trigger: triggerUpload, uploading } = useImageUpload();
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);

  function addText() {
    const el: TextElement = {
      id: nanoid(), type: "text",
      x: 100, y: 100, w: 400, h: 80,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, content: t.editor.writeHere,
      ...textDefaults(theme),
    };
    addElement(el);
    onClose();
  }

  function addShape(shape: ShapeElement["shape"]) {
    const el: ShapeElement = {
      id: nanoid(), type: "shape",
      x: 200, y: 200, w: 200, h: 200,
      rotation: 0, opacity: 1,
      zIndex: (activeSlide?.elements.length ?? 0) + 1,
      locked: false, shape,
      ...shapeDefaults(theme),
    };
    addElement(el);
    onClose();
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <button onClick={addText} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <TextT size={18} weight="regular" /> {t.editor.tools.text}
      </button>
      <button onClick={() => addShape("rect")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Rectangle size={18} weight="regular" /> {t.editor.rectangle}
      </button>
      <button onClick={() => addShape("circle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Circle size={18} weight="regular" /> {t.editor.circle}
      </button>
      <button onClick={() => addShape("triangle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Triangle size={18} weight="regular" /> {t.editor.triangle}
      </button>
      <button onClick={() => addShape("diamond")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Diamond size={18} weight="regular" /> Diamond
      </button>
      <button onClick={() => addShape("star")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Star size={18} weight="regular" /> Star
      </button>
      <button onClick={() => {
        addElement({ id: nanoid(), type: "arrow", x: 200, y: 400, w: 300, h: 60, rotation: 0, opacity: 1, zIndex: (activeSlide?.elements.length ?? 0) + 1, locked: false, direction: "right", ...arrowDefaults(theme) } satisfies ArrowElement);
        onClose();
      }} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <ArrowRight size={18} weight="regular" /> Arrow
      </button>
      <button onClick={() => {
        addElement({ id: nanoid(), type: "divider", x: 100, y: 500, w: 600, h: 10, rotation: 0, opacity: 1, zIndex: (activeSlide?.elements.length ?? 0) + 1, locked: false, ...dividerDefaults(theme) } satisfies DividerElement);
        onClose();
      }} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Minus size={18} weight="regular" /> Line
      </button>
      <button onClick={() => {
        addElement({ id: nanoid(), type: "line", x: 200, y: 300, w: 300, h: 200, rotation: 0, opacity: 1, zIndex: (activeSlide?.elements.length ?? 0) + 1, locked: false, x1: 0, y1: 0, x2: 300, y2: 200, ...lineDefaults(theme) } satisfies LineElement);
        onClose();
      }} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <LineSegment size={18} weight="regular" /> Connector
      </button>
      <button onClick={() => {
        addElement({ id: nanoid(), type: "table", x: 100, y: 200, w: 600, h: 300, rotation: 0, opacity: 1, zIndex: (activeSlide?.elements.length ?? 0) + 1, locked: false, ...tableDefaults(theme) } satisfies TableElement);
        onClose();
      }} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <GridNine size={18} weight="regular" /> Table
      </button>
      <button onClick={() => {
        const url = prompt("Paste video URL (.mp4, .webm, etc.):");
        if (!url) return;
        addElement({ id: nanoid(), type: "video", x: 200, y: 200, w: 640, h: 360, rotation: 0, opacity: 1, zIndex: (activeSlide?.elements.length ?? 0) + 1, locked: false, src: url, ...videoDefaults() } satisfies VideoElement);
        onClose();
      }} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <VideoCamera size={18} weight="regular" /> Video
      </button>
      <button onClick={() => setShowIconPicker(true)} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Smiley size={18} weight="regular" /> Icon
      </button>
      <button onClick={() => { triggerUpload(); onClose(); }} disabled={uploading} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-50">
        <ImageIcon size={18} weight="regular" /> {uploading ? t.editor.uploading : t.editor.image}
      </button>
      <button onClick={() => setShowUnsplash(true)} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <ImageSquare size={18} weight="regular" /> Stock Images
      </button>
      {showIconPicker && <IconPicker onClose={() => { setShowIconPicker(false); onClose(); }} />}
      {showUnsplash && <UnsplashPicker onClose={() => { setShowUnsplash(false); onClose(); }} />}
    </div>
  );
}
