import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function ViewerNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-6 text-center">
      <p className="text-[10px] tracking-[0.5em] text-neutral-600 uppercase">
        404
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-tight text-white sm:text-8xl">
        NO ENCONTRADA
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
        Esta presentación no existe o es privada.
      </p>
      <Link
        href="/login"
        className="mt-8 bg-white px-8 py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors"
      >
        Crear mi propia presentación <ArrowRight size={14} className="inline ml-1" />
      </Link>
    </div>
  );
}
