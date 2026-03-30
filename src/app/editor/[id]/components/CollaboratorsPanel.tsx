"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { UsersThree, X, Trash, UserPlus } from "@phosphor-icons/react";
import { toast } from "sonner";

interface Collaborator {
  id: string;
  role: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CollaboratorsPanel({ open, onClose }: Props) {
  const presentationId = useEditorStore((s) => s.presentationId);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [maxCollaborators, setMaxCollaborators] = useState<number | null>(0);
  const [canCollaborate, setCanCollaborate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!open || !presentationId) return;
    setLoading(true);
    fetch(`/api/presentations/${presentationId}/collaborators`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setCollaborators(data.collaborators);
          setMaxCollaborators(data.maxCollaborators);
          setCanCollaborate(data.canCollaborate);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, presentationId]);

  async function handleAdd() {
    if (!email.trim() || !presentationId) return;
    setAdding(true);
    const res = await fetch(`/api/presentations/${presentationId}/collaborators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), role: "editor" }),
    });
    const data = await res.json();
    if (res.ok) {
      setCollaborators((prev) => [...prev, data]);
      setEmail("");
      toast.success(`Added ${data.name || data.email}`);
    } else {
      toast.error(data.error || "Failed to add collaborator");
    }
    setAdding(false);
  }

  async function handleRemove(collaboratorId: string) {
    if (!presentationId) return;
    const res = await fetch(
      `/api/presentations/${presentationId}/collaborators?collaboratorId=${collaboratorId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      toast.success("Collaborator removed");
    } else {
      toast.error("Failed to remove collaborator");
    }
  }

  if (!open) return null;

  const limitLabel = maxCollaborators === null ? "unlimited" : String(maxCollaborators);

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-lg border border-neutral-700 bg-[#1e1e1e] shadow-xl md:inset-x-auto md:bottom-auto md:top-14 md:right-60 md:left-auto md:w-80">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <UsersThree size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Collaborators ({collaborators.length}/{limitLabel})
          </span>
        </div>
        <button onClick={onClose} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto p-3 space-y-2 md:max-h-72">
        {loading && <p className="py-4 text-center text-xs text-neutral-600">Loading...</p>}

        {!loading && !canCollaborate && (
          <p className="py-4 text-center text-xs text-neutral-500">
            Collaboration requires a Studio or Agency plan.
          </p>
        )}

        {!loading && canCollaborate && collaborators.length === 0 && (
          <p className="py-4 text-center text-xs text-neutral-600">No collaborators yet.</p>
        )}

        {collaborators.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded bg-neutral-800/50 px-2 py-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-medium text-neutral-300">
              {(c.name ?? c.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-neutral-200">{c.name || c.email}</p>
              <p className="truncate text-[10px] text-neutral-500">{c.email} · {c.role}</p>
            </div>
            <button
              onClick={() => handleRemove(c.id)}
              className="shrink-0 rounded p-1 text-neutral-600 hover:bg-neutral-700 hover:text-red-400 transition-colors"
              aria-label={`Remove ${c.name || c.email}`}
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>

      {canCollaborate && (
        <div className="border-t border-neutral-800 p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
            className="flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Invite by email..."
              className="min-w-0 flex-1 rounded border border-neutral-700 bg-[#111111] px-2 py-1.5 text-xs text-neutral-300 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <button
              type="submit"
              disabled={adding || !email.trim()}
              className="flex shrink-0 items-center gap-1 rounded bg-white px-2.5 py-1.5 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              <UserPlus size={12} />
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
