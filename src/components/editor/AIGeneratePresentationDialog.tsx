"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkle, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { GeneratedSlide } from "@/app/api/ai/generate-presentation/route";
import { AIGenerateOutlinePreview } from "./AIGenerateOutlinePreview";
import { AIGeneratePresentationForm } from "./AIGeneratePresentationForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AIGeneratePresentationDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState<number>(8);
  const [language, setLanguage] = useState("es");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTopic(""); setStyle(""); setError(""); setGeneratedSlides(null);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  async function handleGenerate() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    setGeneratedSlides(null);
    try {
      const res = await fetch("/api/ai/generate-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), slideCount, language, style: style.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Generation failed" }));
        if (data.error === "PLAN_LIMIT") setError("Upgrade to Creator plan for AI generation");
        else if (res.status === 429) setError(`Rate limit reached. Try again in ${data.retryAfter ?? 60}s`);
        else setError(data.error ?? "Generation failed");
        return;
      }
      const { slides } = (await res.json()) as { slides: GeneratedSlide[] };
      setGeneratedSlides(slides);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!generatedSlides || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/ai/build-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: generatedSlides,
          title: generatedSlides[0]?.title ?? topic.trim(),
        }),
      });
      if (!res.ok) {
        toast.error(res.status === 403 ? "Plan limit reached" : "Failed to create presentation");
        setCreating(false);
        return;
      }
      const pres = await res.json();
      toast.success("Presentation created with AI");
      router.push(`/editor/${pres.id}`);
      router.refresh();
      onClose();
    } catch {
      toast.error("Failed to create presentation");
    } finally {
      setCreating(false);
    }
  }

  const showPreview = generatedSlides !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" role="dialog" aria-modal="true" onClick={() => !loading && !creating && onClose()}>
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-[#1e1e1e] p-4 shadow-2xl sm:max-w-lg sm:rounded-sm sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle size={18} weight="fill" className="text-amber-400" />
            <h2 className="text-lg font-medium text-white">{showPreview ? "Preview Outline" : "Generate Presentation"}</h2>
          </div>
          <button onClick={onClose} disabled={loading || creating} className="text-neutral-500 hover:text-neutral-200 disabled:opacity-30" aria-label="Close"><X size={18} /></button>
        </div>

        {!showPreview ? (
          <AIGeneratePresentationForm
            topic={topic} onTopicChange={setTopic}
            slideCount={slideCount} onSlideCountChange={setSlideCount}
            language={language} onLanguageChange={setLanguage}
            style={style} onStyleChange={setStyle}
            loading={loading} error={error}
            onGenerate={handleGenerate} onClose={onClose}
            textareaRef={textareaRef}
          />
        ) : (
          <div>
            <AIGenerateOutlinePreview slides={generatedSlides} />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button onClick={() => setGeneratedSlides(null)} className="rounded px-3 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">Back</button>
              <div className="flex gap-2">
                <button onClick={handleGenerate} disabled={loading} className="rounded border border-neutral-600 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-40">
                  {loading ? "Regenerating..." : "Regenerate"}
                </button>
                <button onClick={handleCreate} disabled={creating} className="flex items-center gap-1.5 rounded bg-white px-4 py-2 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-40 transition-colors">
                  {creating && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-[#161616]" />}
                  {creating ? "Creating..." : "Create Presentation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
