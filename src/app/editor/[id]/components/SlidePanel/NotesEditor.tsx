"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useTranslation } from "@/lib/i18n/context";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { UpgradeModal } from "@/components/UpgradeModal";
import type { TextElement } from "@/types/elements";

function extractSlideText(slide: ReturnType<typeof useEditorStore.getState>["slides"][number]): string {
  return slide.elements
    .filter((el): el is TextElement => el.type === "text")
    .map((el) => el.content.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean)
    .join("\n");
}

export function NotesEditor() {
  const { t } = useTranslation();
  const slide = useEditorStore((s) => s.getActiveSlide());
  const updateSlideNotes = useEditorStore((s) => s.updateSlideNotes);
  const presentationId = useEditorStore((s) => s.presentationId);
  const [value, setValue] = useState(slide?.notes ?? "");
  const [generating, setGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [title, setTitle] = useState("");
  const { plan } = usePlanLimits();

  const isPaid = plan === "creator" || plan === "studio" || plan === "agency";

  useEffect(() => {
    setValue(slide?.notes ?? "");
  }, [slide?.id, slide?.notes]);

  useEffect(() => {
    if (!presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.title) setTitle(d.title); })
      .catch(() => {});
  }, [presentationId]);

  const generateNotes = useCallback(async () => {
    if (!slide) return;
    if (!isPaid) {
      setShowUpgrade(true);
      return;
    }

    const slideContent = extractSlideText(slide);
    if (!slideContent) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideContent,
          presentationTitle: title || "Untitled",
        }),
      });
      if (!res.ok) return;
      const data: { notes: string } = await res.json();
      if (data.notes) {
        setValue(data.notes);
        updateSlideNotes(data.notes);
      }
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  }, [slide, isPaid, title, updateSlideNotes]);

  return (
    <div className="border-t border-neutral-800 px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          {t.editor.notes ?? "Notes"}
        </label>
        <button
          onClick={generateNotes}
          disabled={generating}
          title="Generate notes with AI"
          className="flex h-6 min-w-[24px] items-center gap-1 rounded px-1.5 text-[10px] text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300 disabled:opacity-50"
        >
          {generating ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-neutral-500 border-t-neutral-300" />
          ) : (
            <Sparkle size={12} weight="fill" />
          )}
          <span className="hidden sm:inline">AI</span>
        </button>
      </div>
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
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="AI Speaker Notes"
        requiredPlan="creator"
      />
    </div>
  );
}
