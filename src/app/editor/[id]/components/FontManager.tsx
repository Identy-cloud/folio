"use client";

import { useState, useRef } from "react";
import { X, Trash, UploadSimple, SpinnerGap } from "@phosphor-icons/react";
import { useCustomFonts, type CustomFont } from "@/hooks/useCustomFonts";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { UpgradeModal } from "@/components/UpgradeModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCEPTED = ".woff2,.woff,.ttf,.otf";

export function FontManager({ open, onClose }: Props) {
  const { fonts, loading, refetch } = useCustomFonts();
  const { limits } = usePlanLimits();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  async function handleUpload(file: File) {
    if (!limits.canUseCustomFonts) {
      setShowUpgrade(true);
      return;
    }
    setError(null);
    setUploading(true);
    const name = file.name.replace(/\.\w+$/, "");
    const family = `custom-${name.replace(/\s+/g, "-").toLowerCase()}`;
    const form = new FormData();
    form.append("file", file);
    form.append("name", name);
    form.append("family", family);
    try {
      const res = await fetch("/api/fonts", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Upload failed");
        return;
      }
      await refetch();
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(font: CustomFont) {
    setDeleting(font.id);
    try {
      await fetch(`/api/fonts?id=${font.id}`, { method: "DELETE" });
      await refetch();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-md rounded-xl bg-[#1a1a1a] border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <h2 className="text-sm font-semibold text-neutral-100">Custom Fonts</h2>
            <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:bg-neutral-800">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {loading && <p className="text-xs text-neutral-500">Loading...</p>}
            {!loading && fonts.length === 0 && (
              <p className="text-xs text-neutral-500">No custom fonts yet.</p>
            )}
            {fonts.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-neutral-200">{f.name}</p>
                  <p className="text-[10px] text-neutral-500" style={{ fontFamily: f.family }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(f)}
                  disabled={deleting === f.id}
                  className="ml-2 shrink-0 rounded p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-red-400 disabled:opacity-50"
                >
                  {deleting === f.id ? <SpinnerGap size={14} className="animate-spin" /> : <Trash size={14} />}
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-800 px-4 py-3">
            {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
            <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }} />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-50"
            >
              {uploading ? <SpinnerGap size={14} className="animate-spin" /> : <UploadSimple size={14} />}
              {uploading ? "Uploading..." : "Upload Font"}
            </button>
          </div>
        </div>
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} feature="Custom Fonts" requiredPlan="studio" />
    </>
  );
}
