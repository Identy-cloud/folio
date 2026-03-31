"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { EmbedElement } from "@/types/elements";

interface Props { element: EmbedElement }

export function EmbedProperties({ element }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [url, setUrl] = useState(element.url);

  useEffect(() => setUrl(element.url), [element.url]);

  function commit() {
    if (url.trim() && url !== element.url) {
      updateElement(element.id, { url: url.trim() });
      pushHistory();
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">Embed</span>
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-silver/50">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full rounded border border-steel bg-navy px-2 py-1.5 text-xs text-silver outline-none placeholder:text-silver/40 focus:border-silver/50"
        />
      </label>
      <p className="text-[10px] text-silver/40 leading-relaxed">
        Supports YouTube, Vimeo, Loom, and any iframe URL.
      </p>
    </div>
  );
}
