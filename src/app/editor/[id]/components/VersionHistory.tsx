"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { createVersionSnapshot } from "../hooks/useAutoSave";
import { ClockCounterClockwise, ArrowCounterClockwise, Plus } from "@phosphor-icons/react";

interface Version {
  id: string;
  version: number;
  title: string | null;
  createdAt: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function VersionHistory({ onClose }: { onClose: () => void }) {
  const presentationId = useEditorStore((s) => s.presentationId);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchVersions = useCallback(() => {
    if (!presentationId) return;
    setLoading(true);
    fetch(`/api/presentations/${presentationId}/versions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Version[]) => setVersions(data))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [presentationId]);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);

  async function handleSnapshot() {
    if (!presentationId) return;
    setCreating(true);
    await createVersionSnapshot(presentationId, "Manual snapshot");
    fetchVersions();
    setCreating(false);
  }

  async function handleRestore(versionId: string) {
    if (!presentationId) return;
    setRestoring(versionId);
    try {
      const res = await fetch(
        `/api/presentations/${presentationId}/versions/${versionId}/restore`,
        { method: "POST" }
      );
      if (res.ok) {
        const slidesRes = await fetch(`/api/presentations/${presentationId}/slides`);
        if (slidesRes.ok) {
          const slides = await slidesRes.json();
          useEditorStore.getState().init(presentationId, slides);
        }
      }
    } finally {
      setRestoring(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <ClockCounterClockwise size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Versions
          </span>
        </div>
        <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-300">
          Close
        </button>
      </div>
      <div className="border-b border-neutral-800 px-3 py-2">
        <button
          onClick={handleSnapshot}
          disabled={creating}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          <Plus size={12} />
          {creating ? "Saving..." : "Save snapshot"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading && (
          <p className="py-4 text-center text-xs text-neutral-600">Loading...</p>
        )}
        {!loading && versions.length === 0 && (
          <p className="py-4 text-center text-xs text-neutral-600">No versions yet</p>
        )}
        {versions.map((v) => (
          <div
            key={v.id}
            className="group flex items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full shrink-0 bg-neutral-600" />
            <div className="flex-1 min-w-0">
              <span className="block truncate">
                {v.title || `Version ${v.version}`}
              </span>
              <span className="text-neutral-600">{relativeTime(v.createdAt)}</span>
            </div>
            {confirmId === v.id ? (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring === v.id}
                  className="rounded bg-amber-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {restoring === v.id ? "..." : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="rounded bg-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-300 hover:bg-neutral-600"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(v.id)}
                className="shrink-0 rounded p-1 text-neutral-600 opacity-0 group-hover:opacity-100 hover:text-neutral-300 transition-opacity"
                title="Restore this version"
              >
                <ArrowCounterClockwise size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
