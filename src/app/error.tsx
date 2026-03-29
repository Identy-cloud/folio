"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-4 text-center">
      <FolioLogo size={28} className="text-2xl text-white/20" />
      <h1 className="mt-8 font-display text-6xl tracking-tight text-white sm:text-8xl">OOPS</h1>
      <p className="mt-4 text-sm text-neutral-400">
        Something went wrong. Try again or go back to the dashboard.
      </p>
      {error?.digest && (
        <p className="mt-2 font-mono text-[10px] text-neutral-700">ID: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="bg-white px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-black uppercase hover:bg-neutral-200 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="border border-neutral-700 px-6 py-2.5 text-xs tracking-[0.2em] text-neutral-300 uppercase hover:border-white hover:text-white transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
