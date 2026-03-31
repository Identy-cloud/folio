"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { VideoElement } from "@/types/elements";

interface Props {
  element: VideoElement;
}

export function VideoProperties({ element }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const [src, setSrc] = useState(element.src);
  const [poster, setPoster] = useState(element.poster ?? "");

  useEffect(() => setSrc(element.src), [element.src]);
  useEffect(() => setPoster(element.poster ?? ""), [element.poster]);

  function commitSrc() {
    if (src.trim() && src !== element.src) {
      updateElement(element.id, { src: src.trim() });
      pushHistory();
    }
  }

  function commitPoster() {
    const val = poster.trim() || undefined;
    if (val !== (element.poster ?? undefined)) {
      updateElement(element.id, { poster: val });
      pushHistory();
    }
  }

  function toggle(key: "autoplay" | "loop" | "muted") {
    updateElement(element.id, { [key]: !element[key] });
    pushHistory();
  }

  const inputCls =
    "w-full rounded border border-steel bg-navy px-2 py-1.5 text-xs text-silver outline-none placeholder:text-silver/40 focus:border-silver/50";
  const toggleCls = (on: boolean) =>
    `min-h-[44px] flex items-center justify-between rounded border px-3 py-2 text-xs transition-colors ${
      on
        ? "border-blue-600 bg-blue-950/30 text-blue-300"
        : "border-steel text-silver/70 hover:bg-white/5"
    }`;

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-medium uppercase tracking-wider text-silver/70">
        Video
      </span>
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-silver/50">Source URL</span>
        <input
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          onBlur={commitSrc}
          onKeyDown={(e) => e.key === "Enter" && commitSrc()}
          placeholder="https://example.com/video.mp4"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] text-silver/50">Poster URL</span>
        <input
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          onBlur={commitPoster}
          onKeyDown={(e) => e.key === "Enter" && commitPoster()}
          placeholder="Thumbnail image URL (optional)"
          className={inputCls}
        />
      </label>
      <div className="space-y-1">
        <button onClick={() => toggle("autoplay")} className={toggleCls(element.autoplay)}>
          <span>Autoplay</span>
          <span className="text-[10px]">{element.autoplay ? "ON" : "OFF"}</span>
        </button>
        <button onClick={() => toggle("loop")} className={toggleCls(element.loop)}>
          <span>Loop</span>
          <span className="text-[10px]">{element.loop ? "ON" : "OFF"}</span>
        </button>
        <button onClick={() => toggle("muted")} className={toggleCls(element.muted)}>
          <span>Muted</span>
          <span className="text-[10px]">{element.muted ? "ON" : "OFF"}</span>
        </button>
      </div>
      <p className="text-[10px] leading-relaxed text-silver/40">
        Video plays only in viewer mode. Editor shows poster or thumbnail.
      </p>
    </div>
  );
}
