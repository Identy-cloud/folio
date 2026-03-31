"use client";

import { useState, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { LOCALES } from "@/lib/i18n";
import { useClickOutside } from "@/hooks/useClickOutside";

export function LocaleSelector() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded px-2 py-1 text-xs text-silver/70 uppercase tracking-wider hover:text-silver transition-colors"
        aria-label="Idioma"
        aria-expanded={open}
      >
        {current?.code ?? "ES"}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded border border-steel bg-slate py-1 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`block w-full px-3 py-1.5 text-left text-xs transition-colors ${
                locale === l.code
                  ? "bg-accent text-white"
                  : "text-silver hover:bg-white/5"
              }`}
            >
              <span className="uppercase mr-2 text-silver/50">{l.code}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
