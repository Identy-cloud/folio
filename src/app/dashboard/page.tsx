"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, MagnifyingGlass, SortAscending, Funnel, SquaresFour, List, UploadSimple } from "@phosphor-icons/react";
import { PresentationCard } from "./presentation-card";
import type { SlideElement } from "@/types/elements";
import { SkeletonGrid } from "./skeleton-grid";
import { TemplateModal } from "./template-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { PromptDialog } from "./prompt-dialog";
import { ThemeDialog } from "./theme-dialog";
import { useTranslation } from "@/lib/i18n/context";
import { AnalyticsDialog } from "./analytics-dialog";
import { FolderList } from "./folder-list";
import type { FolderItem } from "./folder-list";
import { MoveToFolderDialog } from "./move-folder-dialog";
import { BulkActionBar } from "./bulk-action-bar";
import { useBulkSelection } from "./use-bulk-selection";
import { AnalyticsOverview } from "./analytics-overview";
import { RecentSection } from "./recent-section";
import { useWorkspace } from "./workspace-context";
import { AIGeneratePresentationDialog } from "@/components/editor/AIGeneratePresentationDialog";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { UpgradeModal } from "@/components/UpgradeModal";
import { requiredPlanFor } from "@/lib/plan-limits";
import { EmptyState } from "./empty-state";
import { UpgradeCelebration } from "./upgrade-celebration";
import { UsageIndicators } from "./usage-indicators";
import { GettingStarted } from "./getting-started";

interface Presentation {
  id: string;
  title: string;
  slug: string;
  theme: string;
  isPublic: boolean;
  thumbnailUrl: string | null;
  updatedAt: string;
  publishAt: string | null;
  folderId: string | null;
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
  | { type: "rename-folder"; folder: FolderItem }
  | { type: "delete-folder"; folderId: string }
  | { type: "move"; presentationId: string }
  | { type: "bulk-delete" }
  | { type: "bulk-move" }
  | null;

export default function DashboardPage() {
  const { t } = useTranslation();
  const { activeWorkspaceId } = useWorkspace();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "oldest" | "starred">("recent");
  const [filterBy, setFilterBy] = useState<"all" | "public" | "private" | "starred">("all");
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { limits } = usePlanLimits();
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => {
      if (!limits.canUseAI) { setUpgradeFeature("AI Presentation Generator"); return; }
      setAiDialogOpen(true);
    };
    window.addEventListener("folio:open-ai-presentation", handler);
    return () => window.removeEventListener("folio:open-ai-presentation", handler);
  }, [limits.canUseAI]);

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
        const presUrl = activeWorkspaceId
          ? `/api/presentations?workspaceId=${activeWorkspaceId}`
          : "/api/presentations";
        const [presRes, foldersRes] = await Promise.all([
          fetch(presUrl),
          fetch("/api/folders"),
        ]);
        if (presRes.ok) {
          setPresentations(await presRes.json());
          setFetchError(false);
        } else {
          setFetchError(true);
        }
        if (foldersRes.ok) {
          setFolders(await foldersRes.json());
        }
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    };
    load();
  }, [activeWorkspaceId]);

  async function refreshPresentations() {
    const presUrl = activeWorkspaceId
      ? `/api/presentations?workspaceId=${activeWorkspaceId}`
      : "/api/presentations";
    const res = await fetch(presUrl);
    if (res.ok) setPresentations(await res.json());
  }

  const bulk = useBulkSelection({ onRefresh: refreshPresentations });

  async function refreshFolders() {
    const res = await fetch("/api/folders");
    if (res.ok) setFolders(await res.json());
  }

  async function handleCreateFolder() {
    const { showPrompt } = await import("@/store/dialogStore").then((m) => m.useDialogStore.getState());
    const name = await showPrompt({ title: "New folder", message: "Enter folder name:", placeholder: "My folder" });
    if (!name?.trim()) return;
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      toast.success("Folder created");
      refreshFolders();
    } else {
      toast.error("Failed to create folder");
    }
  }

  async function handleRenameFolder(name: string) {
    if (!dialog || dialog.type !== "rename-folder") return;
    const res = await fetch(`/api/folders/${dialog.folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) toast.success("Folder renamed");
    else toast.error("Failed to rename folder");
    setDialog(null);
    refreshFolders();
  }

  async function handleDeleteFolder() {
    if (!dialog || dialog.type !== "delete-folder") return;
    const folderId = dialog.folderId;
    if (activeFolderId === folderId) setActiveFolderId(null);
    const res = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Folder deleted");
      refreshFolders();
      refreshPresentations();
    } else {
      toast.error("Failed to delete folder");
    }
    setDialog(null);
  }

  async function handleMoveToFolder(folderId: string | null) {
    if (!dialog || dialog.type !== "move") return;
    const res = await fetch(`/api/presentations/${dialog.presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId }),
    });
    if (res.ok) toast.success("Presentation moved");
    else toast.error("Failed to move presentation");
    setDialog(null);
    refreshPresentations();
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

  async function handleExportJson(id: string) {
    try {
      const res = await fetch(`/api/presentations/${id}/export-json`);
      if (!res.ok) { toast.error("Export failed"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      a.download = match?.[1] ?? `presentation-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exported as JSON");
    } catch {
      toast.error("Export failed");
    }
  }

  function handleImportJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const res = await fetch("/api/presentations/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast.success("Presentation imported");
          refreshPresentations();
        } else {
          const err = await res.json().catch(() => ({ error: "Import failed" }));
          toast.error(err.error === "Plan limit reached" ? "Plan limit reached" : "Import failed");
        }
      } catch {
        toast.error("Invalid JSON file");
      }
      input.remove();
    };
    input.click();
  }

  if (loading) return <SkeletonGrid />;

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
        <p className="font-display text-3xl tracking-tight text-silver/40 sm:text-5xl">{t.common.error}</p>
        <p className="mt-3 text-sm text-silver/70">{t.common.connectionError}</p>
        <button
          onClick={() => { setLoading(true); setFetchError(false); window.location.reload(); }}
          className="mt-6 bg-accent px-8 py-3 text-sm font-medium tracking-widest text-white uppercase hover:bg-accent-hover transition-colors"
        >
          {t.common.loading}
        </button>
      </div>
    );
  }

  const filtered = presentations
    .filter((p) => {
      if (activeFolderId !== null && p.folderId !== activeFolderId) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterBy === "public" && !p.isPublic) return false;
      if (filterBy === "private" && p.isPublic) return false;
      if (filterBy === "starred" && !starred.has(p.id)) return false;
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
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Folder sidebar (desktop) / chips (mobile) */}
      <div className="shrink-0 lg:w-52">
        <FolderList
          folders={folders}
          activeFolderId={activeFolderId}
          onSelect={setActiveFolderId}
          onCreate={handleCreateFolder}
          onRename={(f) => setDialog({ type: "rename-folder", folder: f })}
          onDelete={(id) => setDialog({ type: "delete-folder", folderId: id })}
        />
      </div>

      <div className="min-w-0 flex-1">
      <UpgradeCelebration />
      <UsageIndicators />
      {presentations.length > 0 && presentations.length < 3 && (
        <GettingStarted presentationCount={presentations.length} />
      )}
      <AnalyticsOverview />
      {presentations.length >= 5 && !activeFolderId && filterBy === "all" && !search && (
        <RecentSection
          presentations={presentations}
          starred={starred}
          onToggleStar={toggleStar}
        />
      )}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl tracking-tight sm:text-4xl">
          {activeFolderId
            ? folders.find((f) => f.id === activeFolderId)?.name ?? t.dashboard.title
            : t.dashboard.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.common.search}
              aria-label={t.dashboard.searchPlaceholder}
              className="w-full rounded border border-steel bg-slate py-2 pl-8 pr-3 text-xs text-silver outline-none placeholder:text-silver/50 focus:border-silver/50"
            />
          </div>
          <div className="flex items-center gap-1">
            <SortAscending size={14} className="text-silver/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "name" | "oldest")}
              aria-label="Ordenar por"
              className="cursor-pointer rounded border border-steel bg-slate px-2 py-1.5 text-xs text-silver outline-none"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="name">A — Z</option>
              <option value="starred">Starred</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Funnel size={14} className="text-silver/50" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as "all" | "public" | "private" | "starred")}
              aria-label="Filtrar por"
              className="cursor-pointer rounded border border-steel bg-slate px-2 py-1.5 text-xs text-silver outline-none"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="starred">{t.dashboard.starredFilter}</option>
            </select>
          </div>
          <div className="flex rounded border border-steel p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Vista en cuadrícula"
              aria-pressed={viewMode === "grid"}
              className={`rounded p-1.5 transition-colors ${viewMode === "grid" ? "bg-steel text-white" : "text-silver/50 hover:text-silver"}`}
            >
              <SquaresFour size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="Vista en lista"
              aria-pressed={viewMode === "list"}
              className={`rounded p-1.5 transition-colors ${viewMode === "list" ? "bg-steel text-white" : "text-silver/50 hover:text-silver"}`}
            >
              <List size={14} />
            </button>
          </div>
          <button
            onClick={handleImportJson}
            className="shrink-0 border border-steel px-4 py-2 text-xs font-medium tracking-widest text-silver uppercase hover:bg-white/5 transition-colors"
          >
            <UploadSimple size={14} className="inline" /> Import
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-silver px-5 py-2 text-xs font-medium tracking-widest text-white uppercase hover:bg-silver transition-colors"
          >
            <Plus size={14} className="inline" /> {t.dashboard.new}
          </button>
        </div>
      </div>

      {presentations.length === 0 ? (
        <EmptyState
          onOpenTemplates={() => setModalOpen(true)}
          onOpenAI={() => setAiDialogOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-silver/50">
          {t.dashboard.noResults} &ldquo;{search}&rdquo;
        </p>
      ) : (
        <>
          {bulk.selectionMode && (
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => {
                  const allIds = filtered.map((p) => p.id);
                  const allSelected = allIds.every((id) => bulk.selectedIds.has(id));
                  if (allSelected) bulk.clearSelection();
                  else bulk.selectAll(allIds);
                }}
                className="flex h-11 items-center gap-2 rounded px-3 text-xs font-medium text-silver hover:bg-white/5 transition-colors"
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded border ${
                  filtered.length > 0 && filtered.every((p) => bulk.selectedIds.has(p.id))
                    ? "border-white bg-accent text-white"
                    : "border-silver/50"
                }`}>
                  {filtered.length > 0 && filtered.every((p) => bulk.selectedIds.has(p.id)) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </span>
                {t.dashboard.bulkSelectAll}
              </button>
              <span className="text-xs text-silver/50">
                {bulk.selectedIds.size} {t.dashboard.bulkSelected}
              </span>
            </div>
          )}
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-2"
          }>
            {filtered.map((p) => (
              <PresentationCard
                key={p.id}
                presentation={p}
                onDuplicate={() => handleDuplicate(p.id)}
                onRename={() => setDialog({ type: "rename", id: p.id, current: p.title })}
                onDelete={() => setDialog({ type: "delete", id: p.id })}
                onTogglePublic={() => handleTogglePublic(p.id, p.isPublic)}
                onChangeTheme={() => setDialog({ type: "theme", id: p.id, current: p.theme })}
                onExportJson={() => handleExportJson(p.id)}
                onAnalytics={() => { window.location.href = `/dashboard/analytics/${p.id}`; }}
                onMove={() => setDialog({ type: "move", presentationId: p.id })}
                isStarred={starred.has(p.id)}
                onToggleStar={() => toggleStar(p.id)}
                selectionMode={bulk.selectionMode}
                isSelected={bulk.selectedIds.has(p.id)}
                onToggleSelect={() => bulk.toggleSelect(p.id)}
                onLongPress={() => bulk.enterSelectionMode(p.id)}
              />
            ))}
          </div>
        </>
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

      <PromptDialog
        open={dialog?.type === "rename-folder"}
        title="Rename folder"
        defaultValue={dialog?.type === "rename-folder" ? dialog.folder.name : ""}
        placeholder="Folder name"
        onSubmit={handleRenameFolder}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "delete-folder"}
        title="Delete folder"
        message="Presentations inside will be moved to 'All presentations'."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteFolder}
        onCancel={() => setDialog(null)}
      />

      {dialog?.type === "move" && (
        <MoveToFolderDialog
          folders={folders}
          onSelect={handleMoveToFolder}
          onCancel={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={dialog?.type === "bulk-delete"}
        title={t.dashboard.bulkDeleteTitle}
        message={t.dashboard.bulkDeleteConfirm.replace("{count}", String(bulk.selectedIds.size))}
        confirmLabel={t.dashboard.deleteAction}
        destructive
        onConfirm={async () => { setDialog(null); await bulk.bulkDelete(); }}
        onCancel={() => setDialog(null)}
      />

      {dialog?.type === "bulk-move" && (
        <MoveToFolderDialog
          folders={folders}
          onSelect={async (folderId) => { setDialog(null); await bulk.bulkMoveToFolder(folderId); }}
          onCancel={() => setDialog(null)}
        />
      )}
      </div>

      {bulk.selectionMode && bulk.selectedIds.size > 0 && (
        <BulkActionBar
          count={bulk.selectedIds.size}
          onDelete={() => setDialog({ type: "bulk-delete" })}
          onMakePublic={bulk.bulkMakePublic}
          onMakePrivate={bulk.bulkMakePrivate}
          onMoveToFolder={() => setDialog({ type: "bulk-move" })}
          onCancel={bulk.clearSelection}
        />
      )}

      <AIGeneratePresentationDialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} />
      <UpgradeModal
        open={upgradeFeature !== null}
        onClose={() => setUpgradeFeature(null)}
        feature={upgradeFeature ?? ""}
        requiredPlan={requiredPlanFor("canUseAI")}
      />
    </div>
  );
}
