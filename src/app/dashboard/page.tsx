"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, MagnifyingGlass, SortAscending, Funnel } from "@phosphor-icons/react";
import { PresentationCard } from "./presentation-card";
import type { SlideElement } from "@/types/elements";
import { SkeletonGrid } from "./skeleton-grid";
import { TemplateModal } from "./template-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { PromptDialog } from "./prompt-dialog";
import { ThemeDialog } from "./theme-dialog";
import { useTranslation } from "@/lib/i18n/context";
import { AnalyticsDialog } from "./analytics-dialog";

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
  | { type: "analytics"; id: string; title: string }
  | null;

export default function DashboardPage() {
  const { t } = useTranslation();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "oldest" | "starred">("recent");
  const [filterBy, setFilterBy] = useState<"all" | "public" | "private">("all");
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("folio-starred") ?? "[]");
      setStarred(new Set(saved));
    } catch { /* ignore */ }
  }, []);

  function toggleStar(id: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("folio-starred", JSON.stringify([...next]));
      return next;
    });
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/presentations");
        if (res.ok) {
          setPresentations(await res.json());
          setFetchError(false);
        } else {
          setFetchError(true);
        }
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  async function refreshPresentations() {
    const res = await fetch("/api/presentations");
    if (res.ok) setPresentations(await res.json());
  }

  async function handleDuplicate(id: string) {
    const res = await fetch(`/api/presentations/${id}/duplicate`, { method: "POST" });
    if (res.ok) toast.success(t.dashboard.duplicate);
    else toast.error(t.dashboard.errorCreate);
    refreshPresentations();
  }

  async function handleRename(title: string) {
    if (!dialog || dialog.type !== "rename") return;
    const res = await fetch(`/api/presentations/${dialog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) toast.success(t.dashboard.renamed);
    else toast.error(t.dashboard.errorRename);
    setDialog(null);
    refreshPresentations();
  }

  async function handleDelete() {
    if (!dialog || dialog.type !== "delete") return;
    const deletedId = dialog.id;
    setPresentations((prev) => prev.filter((p) => p.id !== deletedId));
    setDialog(null);
    const res = await fetch(`/api/presentations/${deletedId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(t.dashboard.deleted);
    } else {
      toast.error(t.dashboard.errorDelete);
      refreshPresentations();
    }
  }

  async function handleTogglePublic(id: string, isPublic: boolean) {
    const res = await fetch(`/api/presentations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    if (res.ok) toast.success(isPublic ? t.dashboard.nowPrivate : t.dashboard.nowPublic);
    else toast.error(t.dashboard.errorVisibility);
    refreshPresentations();
  }

  async function handleChangeTheme(theme: string) {
    if (!dialog || dialog.type !== "theme") return;
    const res = await fetch(`/api/presentations/${dialog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    if (res.ok) toast.success(t.dashboard.themeChanged);
    else toast.error(t.dashboard.errorTheme);
    setDialog(null);
    refreshPresentations();
  }

  if (loading) return <SkeletonGrid />;

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
        <p className="font-display text-3xl tracking-tight text-neutral-700 sm:text-5xl">{t.common.error}</p>
        <p className="mt-3 text-sm text-neutral-400">{t.common.connectionError}</p>
        <button
          onClick={() => { setLoading(true); setFetchError(false); window.location.reload(); }}
          className="mt-6 bg-white px-8 py-3 text-sm font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors"
        >
          {t.common.loading}
        </button>
      </div>
    );
  }

  const filtered = presentations
    .filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterBy === "public" && !p.isPublic) return false;
      if (filterBy === "private" && p.isPublic) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "starred") {
        const aS = starred.has(a.id) ? 0 : 1;
        const bS = starred.has(b.id) ? 0 : 1;
        if (aS !== bS) return aS - bS;
      }
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl tracking-tight sm:text-4xl">
          {t.dashboard.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.common.search}
              aria-label={t.dashboard.searchPlaceholder}
              className="w-full rounded border border-neutral-700 bg-[#1e1e1e] py-2 pl-8 pr-3 text-xs text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <SortAscending size={14} className="text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "name" | "oldest")}
              className="rounded border border-neutral-700 bg-[#1e1e1e] px-2 py-1.5 text-xs text-neutral-300 outline-none"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="name">A — Z</option>
              <option value="starred">Starred</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Funnel size={14} className="text-neutral-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as "all" | "public" | "private")}
              className="rounded border border-neutral-700 bg-[#1e1e1e] px-2 py-1.5 text-xs text-neutral-300 outline-none"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-neutral-200 px-5 py-2 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-300 transition-colors"
          >
            <Plus size={14} className="inline" /> {t.dashboard.new}
          </button>
        </div>
      </div>

      {presentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
          <p className="font-display text-3xl tracking-tight text-neutral-700 sm:text-5xl">{t.dashboard.empty}</p>
          <p className="mt-3 text-sm text-neutral-400">{t.dashboard.emptyDesc}</p>
          <button onClick={() => setModalOpen(true)} className="mt-6 bg-white px-8 py-3 text-sm font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors">
            {t.dashboard.create}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-500">
          {t.dashboard.noResults} &ldquo;{search}&rdquo;
        </p>
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
              onAnalytics={() => setDialog({ type: "analytics", id: p.id, title: p.title })}
              isStarred={starred.has(p.id)}
              onToggleStar={() => toggleStar(p.id)}
            />
          ))}
        </div>
      )}

      <TemplateModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <PromptDialog
        open={dialog?.type === "rename"}
        title={t.dashboard.renameTitle}
        defaultValue={dialog?.type === "rename" ? dialog.current : ""}
        placeholder={t.dashboard.renamePlaceholder}
        onSubmit={handleRename}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "delete"}
        title={t.dashboard.deleteTitle}
        message={t.dashboard.deleteConfirm}
        confirmLabel={t.dashboard.deleteAction}
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

      <AnalyticsDialog
        open={dialog?.type === "analytics"}
        presentationId={dialog?.type === "analytics" ? dialog.id : null}
        title={dialog?.type === "analytics" ? dialog.title : ""}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
