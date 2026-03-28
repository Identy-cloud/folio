"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirmar", destructive, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4">
        <h3 className="font-display text-lg tracking-tight text-neutral-200">{title}</h3>
        <p className="mt-2 text-sm text-neutral-400">{message}</p>
        <div className="mt-5 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded px-4 py-2 text-xs font-medium transition-colors ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-white text-[#161616] hover:bg-neutral-200"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
