"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-6 text-center">
      <h1 className="font-bebas-neue text-5xl tracking-wide text-white md:text-7xl">
        Folio
      </h1>
      <div className="mt-6 h-px w-16 bg-white/20" />
      <p className="mt-6 max-w-sm text-base text-neutral-400 md:text-lg">
        You&apos;re offline. Check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 rounded-md bg-white px-6 py-3 text-sm font-medium text-[#161616] transition-colors hover:bg-neutral-200 active:bg-neutral-300"
      >
        Try again
      </button>
    </main>
  );
}
