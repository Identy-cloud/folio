"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { LOCALES } from "@/lib/i18n";

export function LocaleSelector() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded px-2 py-1 text-xs text-neutral-400 uppercase tracking-wider hover:text-neutral-200 transition-colors"
        aria-label="Idioma"
        aria-expanded={open}
      >
        {current?.code ?? "ES"}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded border border-neutral-700 bg-[#1e1e1e] py-1 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`block w-full px-3 py-1.5 text-left text-xs transition-colors ${
                locale === l.code
                  ? "bg-white text-[#161616]"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <span className="uppercase mr-2 text-neutral-500">{l.code}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
