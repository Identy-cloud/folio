"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkle, ImageSquare } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { nanoid } from "nanoid";
import type { ImageElement } from "@/types/elements";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SIZE_PRESETS = [
  { label: "Square", w: 1024, h: 1024 },
  { label: "Landscape", w: 1536, h: 1024 },
  { label: "Portrait", w: 1024, h: 1536 },
] as const;

export function AIImageDialog({ open, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ url: string; width: number; height: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());

  useEffect(() => {
    if (open) {
      setPrompt("");
      setError("");
      setPreview(null);
      setSizeIdx(0);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const size = SIZE_PRESETS[sizeIdx];

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setPreview(null);
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), width: size.w, height: size.h }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Generation failed" }));
        if (data.error === "PLAN_LIMIT") setError("Upgrade to Creator plan for AI images");
        else if (res.status === 429) setError(`Rate limit reached. Try again in ${data.retryAfter ?? 60}s`);
        else if (data.error === "STORAGE_LIMIT") setError("Storage limit reached. Upgrade your plan.");
        else setError(data.error ?? "Generation failed");
        return;
      }
      const data = (await res.json()) as { url: string; width: number; height: number };
      setPreview(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleInsert() {
    if (!preview) return;
    const zBase = (activeSlide?.elements.length ?? 0) + 1;
    const scale = Math.min(800 / preview.width, 600 / preview.height, 1);
    const w = Math.round(preview.width * scale);
    const h = Math.round(preview.height * scale);
    const el: ImageElement = {
      id: nanoid(), type: "image",
      x: Math.round((1920 - w) / 2), y: Math.round((1080 - h) / 2),
      w, h, rotation: 0, opacity: 1, zIndex: zBase, locked: false,
      src: preview.url, objectFit: "cover", filter: "none",
    };
    addElement(el);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[20vh] px-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-md rounded border border-neutral-700 bg-[#1e1e1e] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-neutral-700 px-4 py-3">
          <Sparkle size={16} weight="fill" className="text-amber-400" />
          <span className="text-sm font-medium text-white">AI Image</span>
        </div>
        <div className="p-4 space-y-3">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            placeholder="Describe the image you want..."
            className="h-20 w-full resize-none rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            maxLength={1000}
          />
          <div className="flex gap-1.5">
            {SIZE_PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => setSizeIdx(i)} className={`rounded px-2.5 py-1 text-xs transition-colors ${i === sizeIdx ? "bg-white text-[#161616]" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}>
                {p.label}
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {loading && (
            <div className="flex items-center justify-center gap-2 rounded border border-neutral-800 bg-neutral-900/50 py-8">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
              <span className="text-xs text-neutral-400">Generating image (5-15s)...</span>
            </div>
          )}
          {preview && (
            <div className="space-y-2">
              <img src={preview.url} alt="AI generated preview" className="w-full rounded border border-neutral-700 object-contain max-h-48" />
              <div className="flex gap-2">
                <button onClick={handleGenerate} disabled={loading} className="flex-1 rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-40">
                  Regenerate
                </button>
                <button onClick={handleInsert} className="flex-1 flex items-center justify-center gap-1.5 rounded bg-white px-3 py-1.5 text-xs font-medium text-[#161616] hover:bg-neutral-200 transition-colors">
                  <ImageSquare size={14} /> Insert
                </button>
              </div>
            </div>
          )}
          {!preview && !loading && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-600">{prompt.length}/1000 | Ctrl+Enter</span>
              <div className="flex gap-2">
                <button onClick={onClose} className="rounded px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">Cancel</button>
                <button onClick={handleGenerate} disabled={!prompt.trim()} className="flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-colors">
                  Generate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
