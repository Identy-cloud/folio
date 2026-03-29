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
      className="w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-5 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-neutral-200">SETTINGS</h3>

      {!data ? (
        <p className="py-4 text-xs text-neutral-500">Loading...</p>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Title */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="rounded border border-neutral-700 bg-[#161616] px-3 py-2 text-sm text-neutral-200 outline-none focus:border-neutral-500"
            />
          </label>

          {/* Theme */}
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Theme</span>
            <p className="mt-1 text-sm text-neutral-300">{THEMES[data.theme]?.label ?? data.theme}</p>
          </div>

          {/* Visibility */}
          <button
            onClick={togglePublic}
            className="flex w-full items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            {data.isPublic ? <Globe size={14} className="text-green-500" /> : <GlobeX size={14} className="text-neutral-500" />}
            {data.isPublic ? "Public — click to make private" : "Private — click to make public"}
          </button>

          {/* Public URL */}
          {data.isPublic && (
            <div className="rounded bg-[#111] px-3 py-2">
              <span className="text-[10px] text-neutral-600">Public URL</span>
              <p className="text-xs text-neutral-400 truncate">{window.location.origin}/p/{data.slug}</p>
            </div>
          )}

          {/* Delete */}
          <div className="border-t border-neutral-800 pt-4">
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
                  className="flex-1 rounded border border-neutral-700 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
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
        className="mt-4 w-full rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
      >
        Close
      </button>
    </DialogShell>
  );
}
