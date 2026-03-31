"use client";

import { useState, useEffect, useRef } from "react";
import { useDialogStore } from "@/store/dialogStore";
import { DialogShell } from "./DialogShell";

export function GlobalDialog() {
  const type = useDialogStore((s) => s.type);
  const title = useDialogStore((s) => s.title);
  const message = useDialogStore((s) => s.message);
  const placeholder = useDialogStore((s) => s.placeholder);
  const defaultValue = useDialogStore((s) => s.defaultValue);
  const confirmLabel = useDialogStore((s) => s.confirmLabel);
  const confirmVariant = useDialogStore((s) => s.confirmVariant);
  const _resolve = useDialogStore((s) => s._resolve);

  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (type === "prompt") {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (type === "confirm") {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [type, defaultValue]);

  if (!type) return null;

  function handleCancel() {
    _resolve(type === "confirm" ? false : null);
  }

  function handleConfirm() {
    _resolve(type === "confirm" ? true : value);
  }

  const isDanger = confirmVariant === "danger";

  return (
    <DialogShell
      open
      ariaLabel={title}
      onClose={handleCancel}
      className="w-full max-w-sm rounded bg-[#1e1e1e] border border-neutral-700 p-5 shadow-xl mx-4"
    >
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{message}</p>

      {type === "prompt" && (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); }}
          placeholder={placeholder}
          className="mt-3 w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500"
        />
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={handleCancel}
          className="rounded px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Cancel
        </button>
        <button
          ref={confirmRef}
          onClick={handleConfirm}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            isDanger
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-white text-[#161616] hover:bg-neutral-200"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}
