"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "@/components/ui/DialogShell";
import { useEditorStore } from "@/store/editorStore";
import { THEMES } from "@/lib/templates/themes";
import { toast } from "sonner";
import { Trash, Globe, GlobeX } from "@phosphor-icons/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PresentationSettings({ open, onClose }: Props) {
  const router = useRouter();
  const presentationId = useEditorStore((s) => s.presentationId);
  const [data, setData] = useState<{ title: string; theme: string; isPublic: boolean; slug: string } | null>(null);
  const [title, setTitle] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || !presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setData(d);
          setTitle(d.title);
        }
      })
      .catch(() => {});
  }, [open, presentationId]);

  async function saveTitle() {
    if (!title.trim()) return;
    await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });
    toast.success("Title saved");
  }

  async function togglePublic() {
    if (!data) return;
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !data.isPublic }),
    });
    if (res.ok) {
      setData({ ...data, isPublic: !data.isPublic });
      toast.success(data.isPublic ? "Now private" : "Now public");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/presentations/${presentationId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <DialogShell
      open={open}
      ariaLabel="Presentation settings"
      onClose={onClose}
      className="w-full max-w-sm rounded bg-slate border border-steel p-5 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-silver">SETTINGS</h3>

      {!data ? (
        <p className="py-4 text-xs text-silver/50">Loading...</p>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Title */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-silver/50 uppercase tracking-wider">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="rounded border border-steel bg-navy px-3 py-2 text-sm text-silver outline-none focus:border-silver/50"
            />
          </label>

          {/* Theme */}
          <div>
            <span className="text-[10px] text-silver/50 uppercase tracking-wider">Theme</span>
            <p className="mt-1 text-sm text-silver">{THEMES[data.theme]?.label ?? data.theme}</p>
          </div>

          {/* Visibility */}
          <button
            onClick={togglePublic}
            className="flex w-full items-center gap-2 rounded border border-steel px-3 py-2 text-xs text-silver hover:bg-white/5 transition-colors"
          >
            {data.isPublic ? <Globe size={14} className="text-green-500" /> : <GlobeX size={14} className="text-silver/50" />}
            {data.isPublic ? "Public — click to make private" : "Private — click to make public"}
          </button>

          {/* Public URL */}
          {data.isPublic && (
            <div className="rounded bg-navy px-3 py-2">
              <span className="text-[10px] text-silver/40">Public URL</span>
              <p className="text-xs text-silver/70 truncate">{window.location.origin}/p/{data.slug}</p>
            </div>
          )}

          {/* Duplicate */}
          <button
            onClick={async () => {
              const res = await fetch(`/api/presentations/${presentationId}/duplicate`, { method: "POST" });
              if (res.ok) {
                const p = await res.json();
                toast.success("Duplicated");
                window.open(`/editor/${p.id}`, "_blank");
              } else {
                toast.error("Failed to duplicate");
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded border border-steel px-3 py-2 text-xs text-silver hover:bg-white/5 transition-colors"
          >
            Duplicate presentation
          </button>

          {/* Delete */}
          <div className="border-t border-steel/30 pt-4">
            {!deleting ? (
              <button
                onClick={() => setDeleting(true)}
                className="flex w-full items-center justify-center gap-2 rounded border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 transition-colors"
              >
                <Trash size={14} /> Delete presentation
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-500 transition-colors"
                >
                  Confirm delete
                </button>
                <button
                  onClick={() => setDeleting(false)}
                  className="flex-1 rounded border border-steel py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 w-full rounded px-4 py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
      >
        Close
      </button>
    </DialogShell>
  );
}
