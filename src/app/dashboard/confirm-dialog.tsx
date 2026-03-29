"use client";

import { useTranslation } from "@/lib/i18n/context";
import { DialogShell } from "@/components/ui/DialogShell";

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

  return (
    <DialogShell open={open} ariaLabel={title} onClose={onCancel}>
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
    </DialogShell>
  );
}
