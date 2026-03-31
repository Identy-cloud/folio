import Link from "next/link";
import { DmcaSections } from "./dmca-sections";

export default function DmcaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">
          FOLIO
        </Link>
        <Link
          href="/"
          className="text-xs tracking-[0.25em] text-silver/70 uppercase hover:text-white transition-colors"
        >
          Volver
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:py-20">
        <p className="text-[10px] tracking-[0.5em] text-silver/50 uppercase">
          Legal
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
          DMCA y Derechos de Autor
        </h1>
        <p className="mt-4 text-sm text-silver/50">
          Ultima actualizacion: 30 de marzo de 2026
        </p>

        <DmcaSections />
      </main>

      <footer className="flex items-center justify-center py-8">
        <p className="text-[10px] tracking-[0.3em] text-silver/40 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}
