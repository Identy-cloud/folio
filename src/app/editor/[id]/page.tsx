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
      <div className="flex h-screen items-center justify-center bg-[#111111]">
        <p className="text-sm text-neutral-500">{t.editor.loadingEditor}</p>
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
