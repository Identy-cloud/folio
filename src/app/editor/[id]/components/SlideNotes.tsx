"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function SlideNotes() {
  const slide = useEditorStore((s) => s.getActiveSlide());
  const updateSlideNotes = useEditorStore((s) => s.updateSlideNotes);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [local, setLocal] = useState(slide?.notes ?? "");

  useEffect(() => {
    setLocal(slide?.notes ?? "");
  }, [slide?.id, slide?.notes]);

  function commit() {
    if (!slide) return;
    if (local !== slide.notes) {
      updateSlideNotes(local);
      pushHistory();
    }
  }

  return (
    <div className="hidden md:block border-t border-steel/30 bg-navy">
      <div className="px-3 py-1.5">
        <span className="text-[10px] font-medium text-silver/50 uppercase tracking-wider">
          Slide Notes
        </span>
      </div>
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        placeholder="Add speaker notes…"
        className="w-full resize-none bg-transparent px-3 pb-2 text-xs text-silver outline-none placeholder:text-silver/30"
        rows={3}
      />
    </div>
  );
}
