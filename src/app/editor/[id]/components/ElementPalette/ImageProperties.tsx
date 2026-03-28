"use client";

import { useEffect } from "react";
import { Image as ImageIcon } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useImageReplace } from "../../hooks/useImageReplace";
import { useTranslation } from "@/lib/i18n/context";
import type { ImageElement } from "@/types/elements";

interface Props {
  element: ImageElement;
}

export function ImageProperties({ element }: Props) {
  const { t } = useTranslation();
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const { trigger, uploading } = useImageReplace(element.id);

  useEffect(() => {
    function onReplace(e: Event) {
      if ((e as CustomEvent).detail === element.id) trigger();
    }
    window.addEventListener("folio:replace-image", onReplace);
    return () => window.removeEventListener("folio:replace-image", onReplace);
  }, [element.id, trigger]);

  function setObjectFit(value: "cover" | "contain" | "fill") {
    updateElement(element.id, { objectFit: value });
    pushHistory();
  }

  const fits: { value: "cover" | "contain" | "fill"; label: string }[] = [
    { value: "cover", label: t.editor.fitCover },
    { value: "contain", label: t.editor.fitContain },
    { value: "fill", label: t.editor.fitFill },
  ];

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        {t.editor.image}
      </span>

      <button
        onClick={trigger}
        disabled={uploading}
        className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
      >
        <ImageIcon size={14} weight="duotone" />
        {uploading ? t.editor.uploading : t.editor.changeImage}
      </button>

      <div className="flex gap-1">
        {fits.map((f) => (
          <button
            key={f.value}
            onClick={() => setObjectFit(f.value)}
            className={`flex-1 rounded px-2 py-1 text-[10px] ${
              element.objectFit === f.value
                ? "bg-neutral-700 text-neutral-100"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
