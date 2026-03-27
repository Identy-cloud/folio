"use client";

import { useEffect, useState, useCallback } from "react";
import { PresentationCard } from "./presentation-card";
import { SkeletonGrid } from "./skeleton-grid";
import { TemplateModal } from "./template-modal";

interface Presentation {
  id: string;
  title: string;
  slug: string;
  theme: string;
  isPublic: boolean;
  thumbnailUrl: string | null;
  updatedAt: string;
}

export default function DashboardPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPresentations = useCallback(async () => {
    const res = await fetch("/api/presentations");
    if (res.ok) {
      setPresentations(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  async function handleDuplicate(id: string) {
    const original = presentations.find((p) => p.id === id);
    if (!original) return;
    await fetch("/api/presentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${original.title} (copia)`,
        theme: original.theme,
        useTemplate: false,
      }),
    });
    fetchPresentations();
  }

  async function handleRename(id: string) {
    const current = presentations.find((p) => p.id === id);
    const title = prompt("Nuevo título:", current?.title);
    if (!title) return;
    await fetch(`/api/presentations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchPresentations();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta presentación?")) return;
    await fetch(`/api/presentations/${id}`, { method: "DELETE" });
    fetchPresentations();
  }

  async function handleTogglePublic(id: string, isPublic: boolean) {
    await fetch(`/api/presentations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    fetchPresentations();
  }

  if (loading) return <SkeletonGrid />;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-4xl tracking-tight">
          MIS PRESENTACIONES
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-neutral-900 px-6 py-2.5 text-sm font-medium tracking-widest text-white uppercase hover:bg-neutral-700 transition-colors"
        >
          + Nueva presentación
        </button>
      </div>

      {presentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="font-display text-5xl tracking-tight text-neutral-300">
            SIN PRESENTACIONES
          </p>
          <p className="mt-3 text-sm text-neutral-400">
            Crea tu primera presentación para empezar
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 bg-neutral-900 px-8 py-3 text-sm font-medium tracking-widest text-white uppercase hover:bg-neutral-700 transition-colors"
          >
            Crear presentación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentations.map((p) => (
            <PresentationCard
              key={p.id}
              presentation={p}
              onDuplicate={() => handleDuplicate(p.id)}
              onRename={() => handleRename(p.id)}
              onDelete={() => handleDelete(p.id)}
              onTogglePublic={() => handleTogglePublic(p.id, p.isPublic)}
            />
          ))}
        </div>
      )}

      <TemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
