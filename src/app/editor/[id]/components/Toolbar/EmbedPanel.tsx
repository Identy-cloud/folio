"use client";

import { useState, useCallback } from "react";
import { Check, Code, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  slug: string;
}

export function EmbedPanel({ slug }: Props) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(540);
  const [autoplay, setAutoplay] = useState(false);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const src = `${origin}/embed/${slug}${autoplay ? "?autoplay=1" : ""}`;
  const embedCode = `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success(t.editor.embedCopied);
    setTimeout(() => setCopied(false), 2000);
  }, [embedCode, t.editor.embedCopied]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-neutral-300">
        <Code size={14} />
        <span>{t.editor.embed}</span>
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded border border-neutral-700 bg-black">
        <iframe
          src={src}
          title={t.editor.embedPreview}
          className="pointer-events-none w-full"
          style={{ height: 160 }}
        />
      </div>

      {/* Dimensions */}
      <div className="flex items-center gap-2">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[10px] text-neutral-500">{t.editor.embedWidth}</span>
          <input
            type="number"
            min={320}
            max={1920}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 960)}
            className="w-full rounded border border-neutral-700 bg-[#111111] px-2 py-1.5 text-xs text-neutral-300 outline-none focus:border-neutral-500"
          />
        </label>
        <span className="mt-4 text-xs text-neutral-600">x</span>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[10px] text-neutral-500">{t.editor.embedHeight}</span>
          <input
            type="number"
            min={180}
            max={1080}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 540)}
            className="w-full rounded border border-neutral-700 bg-[#111111] px-2 py-1.5 text-xs text-neutral-300 outline-none focus:border-neutral-500"
          />
        </label>
      </div>

      {/* Autoplay toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{t.editor.embedAutoplay}</span>
        <button
          onClick={() => setAutoplay((v) => !v)}
          role="switch"
          aria-checked={autoplay}
          aria-label={t.editor.embedAutoplay}
          className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
            autoplay ? "bg-green-600" : "bg-neutral-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              autoplay ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {/* Code preview + copy */}
      <div className="rounded border border-neutral-700 bg-[#111111] p-2">
        <pre className="max-h-16 overflow-auto text-[10px] leading-relaxed text-neutral-500 break-all whitespace-pre-wrap">
          {embedCode}
        </pre>
      </div>

      <button
        onClick={copyCode}
        className="flex w-full items-center justify-center gap-2 rounded bg-white py-2 text-xs font-medium text-[#161616] hover:bg-neutral-200 transition-colors"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? t.editor.embedCopied : t.editor.embedCopyCode}
      </button>
    </div>
  );
}
