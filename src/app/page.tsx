import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

const FEATURES = [
  { title: "Editorial Design", desc: "Expressive typography, asymmetric layouts, and bold visual storytelling." },
  { title: "5 Templates", desc: "Creative Brief, Pitch Deck, Portfolio, Report, and Minimal — ready to use." },
  { title: "5 Themes", desc: "Editorial Blue, Monochrome, Dark Editorial, Warm Magazine, Swiss Minimal." },
  { title: "Real-time Collaboration", desc: "Work together with your team — see cursors and changes live." },
  { title: "Mobile Adaptive", desc: "Every presentation looks perfect on any device, automatically." },
  { title: "Smart Editor", desc: "Multi-select, snap to grid, layers panel, keyboard shortcuts, and more." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <span className="text-xl sm:text-2xl"><FolioLogo size={22} /></span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hidden sm:block text-xs tracking-[0.15em] text-neutral-500 uppercase hover:text-white transition-colors">
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-xs tracking-[0.25em] text-neutral-400 uppercase hover:text-white transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
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

      {/* Features grid */}
      <section className="border-t border-neutral-800 px-4 py-16 sm:px-8 sm:py-24">
        <p className="text-center text-[10px] tracking-[0.5em] text-neutral-500 uppercase">Features</p>
        <h2 className="mt-3 text-center font-display text-3xl tracking-tight sm:text-5xl">
          TODO LO QUE NECESITAS
        </h2>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-neutral-800 p-6">
              <h3 className="font-display text-lg tracking-tight">{f.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-800 px-4 py-16 text-center sm:px-8 sm:py-24">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          EMPIEZA HOY
        </h2>
        <p className="mt-4 text-sm text-neutral-500">
          Plan gratuito con 3 presentaciones. Sin tarjeta de crédito.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block bg-white px-8 py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors"
        >
          Crear cuenta gratis
        </Link>
      </section>

      <footer className="border-t border-neutral-800 px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Producto</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/pricing" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Empezar gratis
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Legal</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/terms" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Terminos
              </Link>
              <Link href="/privacy" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Cookies
              </Link>
              <Link href="/dmca" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                DMCA
              </Link>
              <Link href="/accessibility" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Accesibilidad
              </Link>
              <Link href="/privacy#ccpa" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                No vender mi informacion
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Empresa</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="mailto:hello@identy.cloud" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Folio — Identy Cloud
        </p>
      </footer>
    </div>
  );
}
