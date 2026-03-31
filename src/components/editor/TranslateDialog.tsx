"use client";

import { useState, useEffect } from "react";
import { GlobeSimple } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { useDialogStore } from "@/store/dialogStore";

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian",
  "Portuguese", "Japanese", "Chinese", "Korean", "Arabic",
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TranslateDialog({ open, onClose }: Props) {
  const [language, setLanguage] = useState<string>("Spanish");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const presentationId = useEditorStore((s) => s.presentationId);

  useEffect(() => {
    if (open) { setError(""); setResult(""); }
  }, [open]);

  if (!open) return null;

  async function handleTranslate() {
    if (loading || !presentationId) return;

    const ok = await useDialogStore.getState().showConfirm({
      title: "Translate presentation",
      message: `This will translate all text to ${language}.`,
      confirmLabel: "Translate",
    });
    if (!ok) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId, targetLanguage: language }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Translation failed" }));
        if (data.error === "PLAN_LIMIT") {
          setError("Upgrade to Creator plan for AI translation");
        } else if (res.status === 429) {
          setError(`Rate limit reached. Try again in ${data.retryAfter ?? 60}s`);
        } else {
          setError(data.error ?? "Translation failed");
        }
        return;
      }

      const { translatedCount } = (await res.json()) as { translatedCount: number };
      setResult(`Translated ${translatedCount} text element${translatedCount !== 1 ? "s" : ""}`);

      const reloadRes = await fetch(`/api/presentations/${presentationId}/slides`);
      if (reloadRes.ok) {
        const slides = await reloadRes.json();
        useEditorStore.setState({
          slides,
          dirty: false,
          saveStatus: "saved",
        });
      }
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
        className="w-full max-w-sm rounded border border-steel bg-slate shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-steel px-4 py-3">
          <GlobeSimple size={16} weight="bold" className="text-blue-400" />
          <span className="text-sm font-medium text-white">Translate presentation</span>
        </div>
        <div className="p-4">
          <label className="mb-2 block text-xs text-silver/70">Target language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            className="w-full cursor-pointer rounded border border-steel bg-navy px-3 py-2 text-sm text-white outline-none focus:border-silver/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          {result && <p className="mt-2 text-xs text-green-400">{result}</p>}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded px-3 py-1.5 text-xs text-silver/70 hover:text-silver transition-colors"
            >
              {result ? "Done" : "Cancel"}
            </button>
            {!result && (
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="flex items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {loading && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-silver/50 border-t-navy" />
                )}
                {loading ? "Translating..." : "Translate"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
