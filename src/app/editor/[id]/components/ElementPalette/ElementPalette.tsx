"use client";

import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import { TextT, Rectangle, Circle, Triangle, Image as ImageIcon, ArrowRight, Minus } from "@phosphor-icons/react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { PositionFields } from "./PositionFields";
import { TextProperties } from "./TextProperties";
import { ShapeProperties } from "./ShapeProperties";
import { ImageProperties } from "./ImageProperties";
import { LayerControls } from "./LayerControls";
import { AlignControls } from "./AlignControls";
import { LockToggle } from "./LockToggle";
import { DeleteButton } from "./DeleteButton";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { TextElement, ShapeElement, ArrowElement, DividerElement, ImageElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

export function ElementPalette() {
  const { t } = useTranslation();
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const editingMode = useEditorStore((s) => s.editingMode);
  const updateSlideBackground = useEditorStore((s) => s.updateSlideBackground);
  const updateSlideBackgroundImage = useEditorStore((s) => s.updateSlideBackgroundImage);
  const { trigger: triggerUpload, uploading } = useImageUpload();
  const { trigger: triggerBgUpload, uploading: bgUploading } = useBgImageUpload();

  const elements = editingMode === "mobile" && activeSlide?.mobileElements ? activeSlide.mobileElements : activeSlide?.elements;
  const selectedElement = elements?.find((el) => selectedIds.includes(el.id));
  const zBase = (elements?.length ?? 0) + 1;

  function add(el: Parameters<typeof addElement>[0]) { addElement(el); }

  const btn = "flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800";

  return (
    <div className="flex w-56 flex-col border-l border-neutral-800 bg-[#161616]">
      <div className="border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t.editor.insert}</span>
      </div>
      <div className="p-3 space-y-1.5">
        <button onClick={() => add({ id: nanoid(), type: "text", x: 100, y: 100, w: 400, h: 80, rotation: 0, opacity: 1, zIndex: zBase, locked: false, content: t.editor.writeHere, fontFamily: "var(--font-dm-sans)", fontSize: 32, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0, color: "#0a0a0a", textAlign: "left", verticalAlign: "top" } satisfies TextElement)} className={btn}>
          <TextT size={16} weight="duotone" /> {t.editor.tools.text}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "rect", fill: "#1a1aff", stroke: "transparent", strokeWidth: 0, borderRadius: 0 } satisfies ShapeElement)} className={btn}>
          <Rectangle size={16} weight="duotone" /> {t.editor.rectangle}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "circle", fill: "#1a1aff", stroke: "transparent", strokeWidth: 0, borderRadius: 0 } satisfies ShapeElement)} className={btn}>
          <Circle size={16} weight="duotone" /> {t.editor.circle}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "arrow", x: 200, y: 400, w: 300, h: 60, rotation: 0, opacity: 1, zIndex: zBase, locked: false, direction: "right", color: "#0a0a0a", strokeWidth: 3 } satisfies ArrowElement)} className={btn}>
          <ArrowRight size={16} weight="duotone" /> {t.editor.arrow}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "divider", x: 100, y: 500, w: 600, h: 10, rotation: 0, opacity: 1, zIndex: zBase, locked: false, color: "#a3a3a3", strokeWidth: 2 } satisfies DividerElement)} className={btn}>
          <Minus size={16} weight="duotone" /> {t.editor.line}
        </button>
        <button onClick={triggerUpload} disabled={uploading} className={`${btn} disabled:opacity-50`}>
          <ImageIcon size={16} weight="duotone" /> {uploading ? t.editor.uploading : t.editor.image}
        </button>
      </div>

      {selectedElement ? (
        <div className="flex-1 overflow-y-auto border-t border-neutral-800 p-3 space-y-4">
          <PositionFields element={selectedElement} />
          {selectedElement.type === "text" && <TextProperties element={selectedElement} />}
          {selectedElement.type === "shape" && <ShapeProperties element={selectedElement} />}
          {selectedElement.type === "image" && <ImageProperties element={selectedElement as ImageElement} />}
          <AlignControls elementId={selectedElement.id} />
          <LayerControls elementId={selectedElement.id} />
          <LockToggle element={selectedElement} />
          <DeleteButton elementId={selectedElement.id} />
        </div>
      ) : activeSlide && (
        <div className="border-t border-neutral-800 p-3 space-y-3">
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{t.editor.slideBg}</span>
          <ColorPicker value={activeSlide.backgroundColor} onChange={updateSlideBackground} />
          {activeSlide.backgroundImage ? (
            <div className="space-y-1">
              <img src={activeSlide.backgroundImage} alt="" className="w-full rounded border border-neutral-700 aspect-video object-cover" />
              <button onClick={() => updateSlideBackgroundImage(null)} className="w-full text-[10px] text-red-400 hover:text-red-300">{t.editor.removeBgImage}</button>
            </div>
          ) : (
            <button onClick={triggerBgUpload} disabled={bgUploading} className="w-full rounded border border-dashed border-neutral-700 py-2 text-[10px] text-neutral-500 hover:border-neutral-500 disabled:opacity-50">
              {bgUploading ? t.editor.uploading : t.editor.addBgImage}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function useBgImageUpload() {
  const updateSlideBackgroundImage = useEditorStore((s) => s.updateSlideBackgroundImage);
  const { trigger, uploading } = useImageUpload();

  return {
    uploading,
    trigger: () => {
      // Override: intercept the upload to set as background instead of element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, filename: file.name }),
        });
        if (!res.ok) return;
        const { signedUrl, publicUrl } = await res.json();
        const putRes = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (putRes.ok) updateSlideBackgroundImage(publicUrl);
      };
      input.click();
    },
  };
}
