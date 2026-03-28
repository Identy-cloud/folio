"use client";

import { THEMES } from "@/lib/templates/themes";

const themeKeys = Object.keys(THEMES);

interface Props {
  open: boolean;
  currentTheme: string;
  onSelect: (theme: string) => void;
  onCancel: () => void;
}

export function ThemeDialog({ open, currentTheme, onSelect, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-label="Cambiar tema">
      <div className="w-full max-w-xs rounded bg-[#1e1e1e] border border-neutral-700 p-5 shadow-xl mx-4">
        <h3 className="font-display text-lg tracking-tight text-neutral-200">CAMBIAR TEMA</h3>
        <div className="mt-3 space-y-1.5">
          {themeKeys.map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors ${
                  currentTheme === key
                    ? "bg-white text-[#161616]"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-neutral-600"
                  style={{ backgroundColor: t.accent }}
                />
                {t.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
