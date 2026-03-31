"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center">
      <h1 className="font-bebas-neue text-5xl tracking-wide text-white md:text-7xl">
        Folio
      </h1>
      <div className="mt-6 h-px w-16 bg-white/20" />
      <p className="mt-6 max-w-sm text-base text-silver/70 md:text-lg">
        You&apos;re offline. Check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:bg-silver"
      >
        Try again
      </button>
    </main>
  );
}
