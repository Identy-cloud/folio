"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { DialogShell } from "@/components/ui/DialogShell";

interface Props {
  open: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({ open, title, message, defaultValue = "", placeholder, onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, defaultValue]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <DialogShell open={open} ariaLabel={title} onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <h3 className="font-display text-lg tracking-tight text-silver">{title}</h3>
        {message && <p className="mt-2 text-sm text-silver/70">{message}</p>}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={title}
          className="mt-3 w-full rounded border border-steel bg-navy px-3 py-2 text-sm text-silver outline-none focus:border-silver/50"
        />
        <div className="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            className="rounded bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-hover transition-colors"
          >
            {t.common.save}
          </button>
        </div>
      </form>
    </DialogShell>
  );
}
