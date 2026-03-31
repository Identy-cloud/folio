"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  const { t } = useTranslation();
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute bottom-0 left-0 right-0 flex max-h-[70vh] flex-col rounded-t-xl bg-slate shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-steel px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-silver/70">
            {title}
          </span>
          <button
            onClick={onClose}
            autoFocus
            className="p-2 text-silver hover:text-white"
            aria-label={t.common.close}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
