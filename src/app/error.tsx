"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-4 text-center">
      <h1 className="font-display text-6xl tracking-tight text-white">ERROR</h1>
      <p className="mt-4 text-sm text-neutral-400">
        Algo salio mal. Intenta de nuevo o vuelve al inicio.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="bg-white px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-black uppercase hover:bg-neutral-200 transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="border border-neutral-700 px-6 py-2.5 text-xs tracking-[0.2em] text-neutral-300 uppercase hover:border-white hover:text-white transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
