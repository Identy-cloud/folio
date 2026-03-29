"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useTranslation } from "@/lib/i18n/context";

export function NotesEditor() {
  const { t } = useTranslation();
  const slide = useEditorStore((s) => s.getActiveSlide());
  const updateSlideNotes = useEditorStore((s) => s.updateSlideNotes);
  const [value, setValue] = useState(slide?.notes ?? "");

  useEffect(() => {
    setValue(slide?.notes ?? "");
  }, [slide?.id, slide?.notes]);

  return (
    <div className="border-t border-neutral-800 px-3 py-2">
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        {t.editor.notes ?? "Notes"}
      </label>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateSlideNotes(e.target.value);
        }}
        placeholder={t.editor.notesPlaceholder ?? "Presenter notes..."}
        rows={3}
        className="w-full resize-none rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-300 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
      />
    </div>
  );
}
