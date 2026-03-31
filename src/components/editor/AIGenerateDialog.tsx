"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useDialogStore } from "@/store/dialogStore";
import type { SlideElement } from "@/types/elements";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AIGenerateDialog({ open, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useEditorStore((s) => s.theme);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);

  useEffect(() => {
    if (open) {
      setPrompt("");
      setError("");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    const hasElements = (activeSlide?.elements.length ?? 0) > 0;
    if (hasElements) {
      const ok = await useDialogStore.getState().showConfirm({
        title: "Replace elements",
        message: "This will replace all elements on the current slide.",
        confirmLabel: "Replace",
        confirmVariant: "danger",
      });
      if (!ok) return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), theme, slideIndex: activeSlideIndex }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Generation failed" }));
        if (data.error === "PLAN_LIMIT") {
          setError("Upgrade to Creator plan for AI generation");
        } else if (res.status === 429) {
          setError(`Rate limit reached. Try again in ${data.retryAfter ?? 60}s`);
        } else {
          setError(data.error ?? "Generation failed");
        }
        return;
      }

      const { elements } = (await res.json()) as { elements: SlideElement[] };
      const state = useEditorStore.getState();
      const slides = state.slides.map((s, i) =>
        i === activeSlideIndex ? { ...s, elements } : s
      );
      useEditorStore.setState({
        slides,
        selectedElementIds: [],
        dirty: true,
        saveStatus: "unsaved",
      });
      state.pushHistory();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded border border-neutral-700 bg-[#1e1e1e] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-neutral-700 px-4 py-3">
          <Sparkle size={16} weight="fill" className="text-amber-400" />
          <span className="text-sm font-medium text-white">Generate with AI</span>
        </div>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            placeholder="Describe the slide you want... e.g. 'A title slide with company name ACME and tagline'"
            className="h-24 w-full resize-none rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            maxLength={2000}
          />
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-neutral-600">
              {prompt.length}/2000 | Ctrl+Enter to generate
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {loading && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-[#161616]" />
                )}
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
