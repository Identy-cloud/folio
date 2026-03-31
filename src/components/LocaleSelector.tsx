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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 items-center gap-1 px-2 text-[11px] font-semibold tracking-[0.15em] text-steel uppercase transition-colors hover:text-navy md:h-auto md:px-2.5 md:py-1.5"
        aria-label="Language"
        aria-expanded={open}
      >
        <span>{locale}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4L5 6.5L7.5 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden border border-silver/30 bg-white py-1 shadow-lg shadow-navy/5">
          {LOCALES.map((l) => {
            const isActive = locale === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`flex h-11 w-full items-center justify-between px-4 text-left text-xs tracking-wide transition-colors md:h-9 ${
                  isActive
                    ? "bg-accent/8 font-medium text-accent"
                    : "text-steel hover:bg-navy/4 hover:text-navy"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 text-[10px] font-semibold tracking-[0.2em] uppercase opacity-40">
                    {l.code}
                  </span>
                  <span>{l.label}</span>
                </span>
                {isActive && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-accent"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
