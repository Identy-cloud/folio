"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import { TextT, Rectangle, Circle, Triangle, Image as ImageIcon, ArrowRight, Minus, Diamond, Star, Pentagon, Hexagon, Code } from "@phosphor-icons/react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { PositionFields } from "./PositionFields";
import { TextProperties } from "./TextProperties";
import { ShapeProperties } from "./ShapeProperties";
import { ImageProperties } from "./ImageProperties";
import { ArrowProperties } from "./ArrowProperties";
import { DividerProperties } from "./DividerProperties";
import { LayerControls } from "./LayerControls";
import { AlignControls } from "./AlignControls";
import { AnimationProperties } from "./AnimationProperties";
import { LockToggle } from "./LockToggle";
import { DeleteButton } from "./DeleteButton";
import { MultiSelectControls } from "./MultiSelectControls";
import { ShadowControls } from "./ShadowControls";
import { EmbedProperties } from "./EmbedProperties";
import { ColorPicker } from "@/components/editor/ColorPicker";
import type { TextElement, ShapeElement, ArrowElement, DividerElement, ImageElement, EmbedElement, SlideElement } from "@/types/elements";
import { textDefaults, shapeDefaults, arrowDefaults, dividerDefaults } from "@/lib/templates/element-defaults";
import { THEMES } from "@/lib/templates/themes";
import { TransitionPicker } from "../SlidePanel/TransitionPicker";
import { useTranslation } from "@/lib/i18n/context";

export function ElementPalette() {
  const { t } = useTranslation();
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const theme = useEditorStore((s) => THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const editingMode = useEditorStore((s) => s.editingMode);
  const updateSlideBackground = useEditorStore((s) => s.updateSlideBackground);
  const updateSlideBackgroundImage = useEditorStore((s) => s.updateSlideBackgroundImage);
  const updateSlideTransition = useEditorStore((s) => s.updateSlideTransition);
  const { trigger: triggerUpload, uploading } = useImageUpload();
  const { trigger: triggerBgUpload, uploading: bgUploading } = useBgImageUpload();

  const elements = editingMode === "mobile" && activeSlide?.mobileElements ? activeSlide.mobileElements : activeSlide?.elements;
  const selectedElement = elements?.find((el) => selectedIds.includes(el.id));
  const zBase = (elements?.length ?? 0) + 1;

  function add(el: Parameters<typeof addElement>[0]) { addElement(el); }

  const btn = "flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800";

  return (
    <div className="flex h-full w-56 flex-col border-l border-neutral-800 bg-[#161616]">
      <div className="border-b border-neutral-800 px-3 py-2">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t.editor.insert}</span>
      </div>
      <div className="shrink-0 p-3 space-y-1.5">
        <button onClick={() => add({ id: nanoid(), type: "text", x: 100, y: 100, w: 400, h: 80, rotation: 0, opacity: 1, zIndex: zBase, locked: false, content: t.editor.writeHere, ...textDefaults(theme) } satisfies TextElement)} className={btn}>
          <TextT size={16} weight="duotone" /> {t.editor.tools.text}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "rect", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Rectangle size={16} weight="duotone" /> {t.editor.rectangle}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "circle", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Circle size={16} weight="duotone" /> {t.editor.circle}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "diamond", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Diamond size={16} weight="duotone" /> Diamond
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "star", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Star size={16} weight="duotone" /> Star
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "pentagon", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Pentagon size={16} weight="duotone" /> Pentagon
        </button>
        <button onClick={() => add({ id: nanoid(), type: "shape", x: 200, y: 200, w: 200, h: 200, rotation: 0, opacity: 1, zIndex: zBase, locked: false, shape: "hexagon", ...shapeDefaults(theme) } satisfies ShapeElement)} className={btn}>
          <Hexagon size={16} weight="duotone" /> Hexagon
        </button>
        <button onClick={() => add({ id: nanoid(), type: "arrow", x: 200, y: 400, w: 300, h: 60, rotation: 0, opacity: 1, zIndex: zBase, locked: false, direction: "right", ...arrowDefaults(theme) } satisfies ArrowElement)} className={btn}>
          <ArrowRight size={16} weight="duotone" /> {t.editor.arrow}
        </button>
        <button onClick={() => add({ id: nanoid(), type: "divider", x: 100, y: 500, w: 600, h: 10, rotation: 0, opacity: 1, zIndex: zBase, locked: false, ...dividerDefaults(theme) } satisfies DividerElement)} className={btn}>
          <Minus size={16} weight="duotone" /> {t.editor.line}
        </button>
        <button onClick={triggerUpload} disabled={uploading} className={`${btn} disabled:opacity-50`}>
          <ImageIcon size={16} weight="duotone" /> {uploading ? t.editor.uploading : t.editor.image}
        </button>
        <button
          onClick={() => {
            const url = prompt("Paste video or embed URL (YouTube, Vimeo, Loom):");
            if (!url) return;
            add({ id: nanoid(), type: "embed", x: 200, y: 200, w: 640, h: 360, rotation: 0, opacity: 1, zIndex: zBase, locked: false, url } as import("@/types/elements").EmbedElement);
          }}
          className={btn}
        >
          <Code size={16} weight="duotone" /> Embed
        </button>
      </div>

      {selectedIds.length > 1 ? (
        <div className="flex-1 overflow-y-auto border-t border-neutral-800 p-3 space-y-4">
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
            {selectedIds.length} elements selected
          </span>
          <MultiSelectControls elementIds={selectedIds} />
          <button
            onClick={() => {
              const deleteElement = useEditorStore.getState().deleteElement;
              selectedIds.forEach((id) => deleteElement(id));
            }}
            className="flex w-full items-center justify-center gap-2 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400 hover:bg-red-950/50 transition-colors"
          >
            {t.editor.deleteElement}
          </button>
        </div>
      ) : selectedElement ? (
        <div className="flex-1 overflow-y-auto border-t border-neutral-800 p-3 space-y-4">
          <PositionFields element={selectedElement} />
          {selectedElement.type === "text" && <TextProperties element={selectedElement} />}
          {selectedElement.type === "shape" && <ShapeProperties element={selectedElement} />}
          {selectedElement.type === "image" && <ImageProperties element={selectedElement as ImageElement} />}
          {selectedElement.type === "arrow" && <ArrowProperties element={selectedElement as ArrowElement} />}
          {selectedElement.type === "divider" && <DividerProperties element={selectedElement as DividerElement} />}
          {selectedElement.type === "embed" && <EmbedProperties element={selectedElement as EmbedElement} />}
          <ShadowControls element={selectedElement} />
          <AnimationProperties element={selectedElement} />
          <AlignControls elementId={selectedElement.id} />
          <LayerControls elementId={selectedElement.id} />
          <LockToggle element={selectedElement} />
          <DeleteButton elementId={selectedElement.id} />
        </div>
      ) : activeSlide && (
        <div className="flex-1 overflow-y-auto border-t border-neutral-800 p-3 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{t.editor.slideBg}</span>
            <ColorPicker value={activeSlide.backgroundColor} onChange={updateSlideBackground} />
            {activeSlide.backgroundImage ? (
              <div className="space-y-1">
                <img src={activeSlide.backgroundImage} alt="" className="w-full rounded border border-neutral-700 aspect-video object-cover" />
                <button onClick={() => updateSlideBackgroundImage(null)} className="w-full text-[10px] text-red-400 hover:text-red-300">{t.editor.removeBgImage}</button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <button onClick={triggerBgUpload} disabled={bgUploading} className="w-full rounded border border-dashed border-neutral-700 py-2 text-[10px] text-neutral-500 hover:border-neutral-500 disabled:opacity-50">
                  {bgUploading ? t.editor.uploading : t.editor.addBgImage}
                </button>
                <input
                  type="url"
                  placeholder="Or paste image URL..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const url = (e.target as HTMLInputElement).value.trim();
                      if (url) { updateSlideBackgroundImage(url); (e.target as HTMLInputElement).value = ""; }
                    }
                  }}
                  className="w-full rounded border border-neutral-800 bg-[#111] px-2 py-1.5 text-[10px] text-neutral-400 outline-none placeholder:text-neutral-700 focus:border-neutral-600"
                />
              </div>
            )}
          </div>
          <TransitionPicker
            current={activeSlide.transition}
            onChange={(tr) => updateSlideTransition(activeSlide.id, tr)}
            duration={activeSlide.duration}
            onDurationChange={(d) => {
              const slides = useEditorStore.getState().slides;
              const updated = slides.map((s) => s.id === activeSlide.id ? { ...s, duration: d || undefined } : s);
              useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" });
              useEditorStore.getState().pushHistory();
            }}
          />
        </div>
      )}
    </div>
  );
}


function useBgImageUpload() {
  const updateSlideBackgroundImage = useEditorStore((s) => s.updateSlideBackgroundImage);
  const [uploading, setUploading] = useState(false);

  return {
    uploading,
    trigger: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentType: file.type, filename: file.name, fileSize: file.size }),
          });
          if (!res.ok) { toast.error("Upload error"); return; }
          const { signedUrl, publicUrl } = await res.json();
          const putRes = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
          if (putRes.ok) updateSlideBackgroundImage(publicUrl);
          else toast.error("Upload failed");
        } catch {
          toast.error("Connection error");
        } finally {
          setUploading(false);
          input.remove();
        }
      };
      input.click();
    },
  };
}
