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
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Embed</span>
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-neutral-500">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
        />
      </label>
      <p className="text-[9px] text-neutral-600 leading-relaxed">
        Supports YouTube, Vimeo, Loom, and any iframe URL.
      </p>
    </div>
  );
}
