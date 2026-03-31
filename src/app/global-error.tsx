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
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-[10px] tracking-[0.5em] text-silver/40 uppercase">
            Critical error
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl">
            SOMETHING WENT WRONG
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-silver/70">
            A critical error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre className="mt-4 max-w-lg overflow-auto rounded bg-red-950/30 px-4 py-2 text-left font-mono text-xs text-red-400">
              {error.message}
            </pre>
          )}
          {error?.digest && (
            <p className="mt-2 font-mono text-[10px] text-silver/40">
              ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={reset}
              className="bg-accent px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-accent-hover"
            >
              Try again
            </button>
            <a
              href="/"
              className="border border-steel px-6 py-2.5 text-xs tracking-[0.2em] text-silver uppercase transition-colors hover:border-white hover:text-white"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
