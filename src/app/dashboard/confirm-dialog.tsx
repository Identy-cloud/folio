"use client";

import { useEffect, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, destructive, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg tracking-tight text-neutral-200">{title}</h3>
        <p className="mt-2 text-sm text-neutral-400">{message}</p>
        <div className="mt-5 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded px-4 py-2 text-xs font-medium transition-colors ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-white text-[#161616] hover:bg-neutral-200"
            }`}
          >
            {confirmLabel ?? t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
}
