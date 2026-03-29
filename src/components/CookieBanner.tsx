"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("folio-cookies-accepted")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("folio-cookies-accepted", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-neutral-800 bg-[#1a1a1a] px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-neutral-400">
        Utilizamos cookies esenciales para el funcionamiento del servicio.{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white transition-colors">
          Politica de privacidad
        </Link>
      </p>
      <button
        onClick={accept}
        className="mt-2 w-full rounded bg-white px-4 py-1.5 text-xs font-medium text-black hover:bg-neutral-200 transition-colors sm:mt-0 sm:w-auto"
      >
        Aceptar
      </button>
    </div>
  );
}
