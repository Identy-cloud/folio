"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { FolioLogo } from "@/components/FolioLogo";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-4 text-center">
      <FolioLogo size={28} className="text-2xl text-white/20" />
      <p className="mt-6 text-[10px] tracking-[0.5em] text-neutral-600 uppercase">
        Dashboard error
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-6xl">
        COULDN&apos;T LOAD DASHBOARD
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
        We had trouble loading your presentations. Please try again.
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre className="mt-4 max-w-lg overflow-auto rounded bg-red-950/30 px-4 py-2 text-left font-mono text-xs text-red-400">
          {error.message}
        </pre>
      )}
      {error?.digest && (
        <p className="mt-2 font-mono text-[10px] text-neutral-700">
          ID: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={reset}
          className="bg-white px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-black uppercase transition-colors hover:bg-neutral-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-neutral-700 px-6 py-2.5 text-xs tracking-[0.2em] text-neutral-300 uppercase transition-colors hover:border-white hover:text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
