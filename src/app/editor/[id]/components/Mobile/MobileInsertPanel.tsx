"use client";

import { nanoid } from "nanoid";
import { TextT, Rectangle, Circle, Triangle, Image as ImageIcon } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { textDefaults, shapeDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useTranslation } from "@/lib/i18n/context";
import type { TextElement, ShapeElement } from "@/types/elements";

export function MobileInsertPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const theme = useEditorStore((s) => THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const { trigger: triggerUpload, uploading } = useImageUpload();

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

  function addShape(shape: "rect" | "circle" | "triangle") {
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
        <TextT size={18} weight="duotone" /> {t.editor.tools.text}
      </button>
      <button onClick={() => addShape("rect")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Rectangle size={18} weight="duotone" /> {t.editor.rectangle}
      </button>
      <button onClick={() => addShape("circle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Circle size={18} weight="duotone" /> {t.editor.circle}
      </button>
      <button onClick={() => addShape("triangle")} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800">
        <Triangle size={18} weight="duotone" /> {t.editor.triangle}
      </button>
      <button onClick={() => { triggerUpload(); onClose(); }} disabled={uploading} className="flex items-center gap-2 rounded border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-50">
        <ImageIcon size={18} weight="duotone" /> {uploading ? t.editor.uploading : t.editor.image}
      </button>
    </div>
  );
}
