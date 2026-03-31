"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("folio-cookies-accepted");
    const rejected = localStorage.getItem("folio-cookies-rejected");
    if (!accepted && !rejected) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("folio-cookies-accepted", "1");
    localStorage.removeItem("folio-cookies-rejected");
    setVisible(false);
    window.dispatchEvent(new Event("folio-cookies-consent"));
  }

  function reject() {
    localStorage.setItem("folio-cookies-rejected", "1");
    localStorage.removeItem("folio-cookies-accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-steel/30 bg-navy px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-silver/70">
        Utilizamos cookies esenciales y de analitica.{" "}
        <Link href="/cookies" className="underline underline-offset-2 hover:text-white transition-colors">
          Politica de cookies
        </Link>
        {" · "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white transition-colors">
          Privacidad
        </Link>
      </p>
      <div className="mt-2 flex gap-2 sm:mt-0">
        <button
          onClick={reject}
          className="w-full rounded border border-steel/60 px-4 py-1.5 text-xs font-medium text-silver hover:border-white hover:text-white transition-colors sm:w-auto"
        >
          Rechazar
        </button>
        <button
          onClick={accept}
          className="w-full rounded bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors sm:w-auto"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
