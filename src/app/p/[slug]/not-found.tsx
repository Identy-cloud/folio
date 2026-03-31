import Link from "next/link";

export default function ViewerNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center sm:px-6">
      <p className="text-[10px] tracking-[0.5em] text-silver/40 uppercase">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-6xl md:text-8xl">
        NO ENCONTRADA
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-silver/50">
        Esta presentación no existe o es privada.
      </p>
      <Link
        href="/login"
        className="mt-8 bg-accent px-6 py-3 text-xs font-semibold tracking-[0.25em] text-white uppercase hover:bg-accent-hover transition-colors sm:px-8"
      >
        Crear mi propia presentación →
      </Link>
    </div>
  );
}
