"use client";

import { FolioLogo } from "@/components/FolioLogo";

export default function OfflinePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 text-center">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1E2A3A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10">
        <FolioLogo size={28} className="text-2xl text-navy/15" />
        <div className="mt-6 h-px w-16 mx-auto bg-accent/30" />
        <p className="mt-6 max-w-sm text-base text-slate md:text-lg">
          You&apos;re offline. Check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 min-h-[48px] rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
