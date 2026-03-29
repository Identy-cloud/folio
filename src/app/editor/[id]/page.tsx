"use client";

import { useEffect, useState, use } from "react";
import { useEditorStore } from "@/store/editorStore";
import { EditorLayout } from "./components/EditorLayout";
import { EditorErrorBoundary } from "./components/EditorErrorBoundary";
import { useTranslation } from "@/lib/i18n/context";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const init = useEditorStore((s) => s.init);

  useEffect(() => {
    async function load() {
      try {
        const [slidesResult, presResult] = await Promise.allSettled([
          fetch(`/api/presentations/${id}/slides`),
          fetch(`/api/presentations/${id}`),
        ]);
        if (slidesResult.status === "rejected" || !slidesResult.value.ok) {
          setError(t.editor.loadError);
          return;
        }
        const slides = await slidesResult.value.json();
        const pres = presResult.status === "fulfilled" && presResult.value.ok
          ? await presResult.value.json()
          : null;
        init(id, slides, pres?.theme);
      } catch {
        setError(t.common.connectionError);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, init, t]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#111111] gap-4">
        <span className="font-display text-3xl tracking-tight text-white/20">FOLIO</span>
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111111]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <EditorErrorBoundary>
      <EditorLayout />
    </EditorErrorBoundary>
  );
}
