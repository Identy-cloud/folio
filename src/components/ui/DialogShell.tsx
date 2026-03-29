"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface Props {
  open: boolean;
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function DialogShell({ open, ariaLabel, onClose, children, className }: Props) {
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        ref={trapRef}
        className={className ?? "w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4"}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
