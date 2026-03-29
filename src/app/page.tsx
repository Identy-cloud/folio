import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <span className="text-xl sm:text-2xl"><FolioLogo size={22} /></span>
        <Link
          href="/login"
          className="text-xs tracking-[0.25em] text-neutral-400 uppercase hover:text-white transition-colors"
        >
          Iniciar sesión
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
          Editorial Slides
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none tracking-tight sm:text-7xl lg:text-9xl">
          PRESENTACIONES
          <br />
          <span className="text-neutral-500">CON ESTILO</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-400">
          Crea presentaciones con estética editorial de agencia.
          Tipografía expresiva, layouts asimétricos, colaboración en
          tiempo real.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/login"
            className="bg-white px-6 py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors sm:px-8"
          >
            Empezar gratis
          </Link>
          <Link
            href="/p/xn9C3QddXu"
            className="border border-neutral-700 px-6 py-3 text-xs tracking-[0.25em] text-neutral-300 uppercase hover:border-white hover:text-white transition-colors sm:px-8"
          >
            Ver demo
          </Link>
        </div>
      </main>

      <footer className="flex flex-col items-center gap-3 py-8">
        <div className="flex gap-6">
          <Link href="/terms" className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Terminos
          </Link>
          <Link href="/privacy" className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Privacidad
          </Link>
          <Link href="/pricing" className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Pricing
          </Link>
        </div>
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}
