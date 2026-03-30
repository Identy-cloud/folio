"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseBulkSelectionOptions {
  onRefresh: () => void;
}

export function useBulkSelection({ onRefresh }: UseBulkSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!selectionMode) setSelectionMode(true);
  }, [selectionMode]);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
    if (!selectionMode) setSelectionMode(true);
  }, [selectionMode]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  const enterSelectionMode = useCallback((id: string) => {
    setSelectionMode(true);
    setSelectedIds(new Set([id]));
  }, []);

  const bulkDelete = useCallback(async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const res = await fetch("/api/presentations/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      toast.success(`${ids.length} deleted`);
      clearSelection();
      onRefresh();
    } else {
      toast.error("Error deleting presentations");
    }
  }, [selectedIds, clearSelection, onRefresh]);

  const bulkMakePublic = useCallback(async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const res = await fetch("/api/presentations/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action: "make_public" }),
    });
    if (res.ok) {
      toast.success(`${ids.length} made public`);
      onRefresh();
    } else {
      toast.error("Error updating presentations");
    }
  }, [selectedIds, onRefresh]);

  const bulkMakePrivate = useCallback(async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const res = await fetch("/api/presentations/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action: "make_private" }),
    });
    if (res.ok) {
      toast.success(`${ids.length} made private`);
      onRefresh();
    } else {
      toast.error("Error updating presentations");
    }
  }, [selectedIds, onRefresh]);

  const bulkMoveToFolder = useCallback(async (folderId: string | null) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const res = await fetch("/api/presentations/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action: "move_to_folder", folderId }),
    });
    if (res.ok) {
      toast.success(`${ids.length} moved`);
      clearSelection();
      onRefresh();
    } else {
      toast.error("Error moving presentations");
    }
  }, [selectedIds, clearSelection, onRefresh]);

  return {
    selectedIds,
    selectionMode,
    toggleSelect,
    selectAll,
    clearSelection,
    enterSelectionMode,
    bulkDelete,
    bulkMakePublic,
    bulkMakePrivate,
    bulkMoveToFolder,
  };
}
