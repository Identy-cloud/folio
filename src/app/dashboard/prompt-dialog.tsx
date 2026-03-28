"use client";

import { useState, useEffect, useRef } from "react";

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
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, defaultValue]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-label={title}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4">
        <h3 className="font-display text-lg tracking-tight text-neutral-200">{title}</h3>
        {message && <p className="mt-2 text-sm text-neutral-400">{message}</p>}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={title}
          className="mt-3 w-full rounded border border-neutral-700 bg-[#161616] px-3 py-2 text-sm text-neutral-200 outline-none focus:border-neutral-500"
        />
        <div className="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded bg-white px-4 py-2 text-xs font-medium text-[#161616] hover:bg-neutral-200 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
