"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { PresentationCard } from "./presentation-card";
import type { SlideElement } from "@/types/elements";
import { SkeletonGrid } from "./skeleton-grid";
import { TemplateModal } from "./template-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { PromptDialog } from "./prompt-dialog";
import { ThemeDialog } from "./theme-dialog";

interface Presentation {
  id: string;
  title: string;
  slug: string;
  theme: string;
  isPublic: boolean;
  thumbnailUrl: string | null;
  updatedAt: string;
  coverSlide?: {
    backgroundColor: string;
    backgroundImage: string | null;
    elements: SlideElement[];
  } | null;
}

type Dialog =
  | { type: "rename"; id: string; current: string }
  | { type: "delete"; id: string }
  | { type: "theme"; id: string; current: string }
  | null;

export default function DashboardPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/presentations");
      if (res.ok) setPresentations(await res.json());
      setLoading(false);
    };
    load();
  }, []);

  async function refreshPresentations() {
    const res = await fetch("/api/presentations");
    if (res.ok) setPresentations(await res.json());
  }

  async function handleDuplicate(id: string) {
    const original = presentations.find((p) => p.id === id);
    if (!original) return;
    await fetch("/api/presentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${original.title} (copia)`, theme: original.theme, useTemplate: false }),
    });
    refreshPresentations();
  }

  async function handleRename(title: string) {
    if (!dialog || dialog.type !== "rename") return;
    const res = await fetch(`/api/presentations/${dialog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) toast.success("Renombrada");
    else toast.error("Error al renombrar");
    setDialog(null);
    refreshPresentations();
  }

  async function handleDelete() {
    if (!dialog || dialog.type !== "delete") return;
    const res = await fetch(`/api/presentations/${dialog.id}`, { method: "DELETE" });
    if (res.ok) toast.success("Eliminada");
    else toast.error("Error al eliminar");
    setDialog(null);
    refreshPresentations();
  }

  async function handleTogglePublic(id: string, isPublic: boolean) {
    const res = await fetch(`/api/presentations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    if (res.ok) toast.success(isPublic ? "Ahora es privada" : "Ahora es pública");
    else toast.error("Error al cambiar visibilidad");
    refreshPresentations();
  }

  async function handleChangeTheme(theme: string) {
    if (!dialog || dialog.type !== "theme") return;
    const res = await fetch(`/api/presentations/${dialog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    if (res.ok) toast.success("Tema cambiado");
    else toast.error("Error al cambiar tema");
    setDialog(null);
    refreshPresentations();
  }

  if (loading) return <SkeletonGrid />;

  const filtered = search
    ? presentations.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : presentations;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl tracking-tight sm:text-4xl">
          MIS PRESENTACIONES
        </h2>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              aria-label="Buscar presentaciones"
              className="w-full rounded border border-neutral-700 bg-[#1e1e1e] py-2 pl-8 pr-3 text-xs text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-neutral-200 px-5 py-2 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-300 transition-colors"
          >
            <Plus size={14} className="inline" /> Nueva
          </button>
        </div>
      </div>

      {presentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
          <p className="font-display text-3xl tracking-tight text-neutral-700 sm:text-5xl">SIN PRESENTACIONES</p>
          <p className="mt-3 text-sm text-neutral-400">Crea tu primera presentación para empezar</p>
          <button onClick={() => setModalOpen(true)} className="mt-6 bg-white px-8 py-3 text-sm font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors">
            Crear presentación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <PresentationCard
              key={p.id}
              presentation={p}
              onDuplicate={() => handleDuplicate(p.id)}
              onRename={() => setDialog({ type: "rename", id: p.id, current: p.title })}
              onDelete={() => setDialog({ type: "delete", id: p.id })}
              onTogglePublic={() => handleTogglePublic(p.id, p.isPublic)}
              onChangeTheme={() => setDialog({ type: "theme", id: p.id, current: p.theme })}
            />
          ))}
        </div>
      )}

      <TemplateModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <PromptDialog
        open={dialog?.type === "rename"}
        title="RENOMBRAR"
        defaultValue={dialog?.type === "rename" ? dialog.current : ""}
        placeholder="Nuevo título"
        onSubmit={handleRename}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="ELIMINAR"
        message="¿Estás seguro de que querés eliminar esta presentación? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDialog(null)}
      />

      <ThemeDialog
        open={dialog?.type === "theme"}
        currentTheme={dialog?.type === "theme" ? dialog.current : ""}
        onSelect={handleChangeTheme}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}
