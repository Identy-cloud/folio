"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function RootError({
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
    <html lang="es">
      <body className="min-h-screen bg-navy font-sans text-white antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
          {/* Dot pattern background */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Geometric corner decorations */}
          <div className="absolute top-[20%] left-[8%] h-px w-32 bg-[#FF4C29]/10" />
          <div className="absolute top-[20%] left-[8%] h-32 w-px bg-[#FF4C29]/10" />
          <div className="absolute bottom-[20%] right-[8%] h-px w-32 bg-[#334756]/30" />
          <div className="absolute bottom-[20%] right-[8%] h-32 w-px bg-[#334756]/30" />

          {/* Floating geometric shapes */}
          <div className="absolute top-[35%] right-[15%] h-20 w-20 border border-[#FF4C29]/[0.07] rotate-45" />
          <div className="absolute bottom-[30%] left-[12%] h-14 w-14 border border-[#334756]/10 rotate-12" />

          <div className="relative z-10">
            <p className="text-[10px] tracking-[0.5em] text-[#FF4C29]/60 uppercase">
              Critical error
            </p>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Bebas Neue', system-ui, sans-serif" }}
            >
              SOMETHING WENT WRONG
            </h1>
            <div className="mx-auto mt-4 h-px w-12 bg-[#FF4C29]/30" />
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#D2D2D2]/50">
              A critical error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === "development" && error?.message && (
              <div className="mx-auto mt-6 max-w-lg overflow-auto rounded-sm border border-red-500/20 bg-red-950/10">
                <div className="flex items-center gap-2 border-b border-red-500/10 px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                  <span className="text-[10px] font-medium tracking-wider text-red-400/60 uppercase">
                    Error details
                  </span>
                </div>
                <pre className="px-5 py-3 text-left font-mono text-xs leading-relaxed text-red-400/80">
                  {error.message}
                </pre>
              </div>
            )}
            {error?.digest && (
              <p className="mt-3 font-mono text-[10px] text-[#D2D2D2]/30">
                ID: {error.digest}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <button
                onClick={reset}
                className="min-h-[48px] rounded-sm bg-[#FF4C29] px-8 py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#c93a1e]"
              >
                Try again
              </button>
              <a
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#334756]/40 px-8 py-3 text-xs tracking-[0.2em] text-[#D2D2D2]/60 uppercase transition-colors hover:border-[#D2D2D2]/50 hover:text-white"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
