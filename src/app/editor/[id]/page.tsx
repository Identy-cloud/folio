"use client";

import { useEffect, useState, use } from "react";
import { useEditorStore } from "@/store/editorStore";
import { EditorLayout } from "./components/EditorLayout";
import { EditorErrorBoundary } from "./components/EditorErrorBoundary";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const init = useEditorStore((s) => s.init);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/presentations/${id}/slides`);
        if (!res.ok) {
          setError("No se pudo cargar la presentación");
          return;
        }
        const slides = await res.json();
        init(id, slides);
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, init]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Cargando editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-100">
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
