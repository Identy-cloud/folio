"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { t } = useTranslation();
  const c = t.cookieBanner;

  useEffect(() => {
    const accepted = localStorage.getItem("folio-cookies-accepted");
    const rejected = localStorage.getItem("folio-cookies-rejected");
    if (!accepted && !rejected) {
      const timer = setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => setAnimating(true));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss(callback: () => void) {
    setAnimating(false);
    setTimeout(() => {
      callback();
      setVisible(false);
    }, 300);
  }

  function accept() {
    dismiss(() => {
      localStorage.setItem("folio-cookies-accepted", "1");
      localStorage.removeItem("folio-cookies-rejected");
      window.dispatchEvent(new Event("folio-cookies-consent"));
    });
  }

  function reject() {
    dismiss(() => {
      localStorage.setItem("folio-cookies-rejected", "1");
      localStorage.removeItem("folio-cookies-accepted");
    });
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm transition-all duration-300 ease-out ${
        animating
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-silver/30 bg-white p-5 shadow-xl shadow-navy/8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <circle cx="12" cy="12" r="10" />
              <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="15" cy="7" r="1" fill="currentColor" stroke="none" />
              <circle cx="10" cy="14" r="1" fill="currentColor" stroke="none" />
              <circle cx="16" cy="13" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="13" cy="17" r="1" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-navy">{c.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-steel">
              {c.description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-3 text-[11px]">
          <Link
            href="/cookies"
            className="text-steel/60 underline underline-offset-2 transition-colors hover:text-navy"
          >
            {c.cookiePolicy}
          </Link>
          <Link
            href="/privacy"
            className="text-steel/60 underline underline-offset-2 transition-colors hover:text-navy"
          >
            {c.privacyPolicy}
          </Link>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={reject}
            className="flex-1 rounded-lg border border-silver/40 px-4 py-2.5 text-xs font-medium text-navy transition-colors hover:border-navy/30 hover:bg-[#FAFAFA]"
          >
            {c.reject}
          </button>
          <button
            onClick={accept}
            className="flex-1 rounded-lg bg-navy px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-navy/90"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
