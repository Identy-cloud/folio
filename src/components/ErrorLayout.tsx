"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

interface ErrorLayoutProps {
  label: string;
  title: string;
  description: string;
  errorMessage?: string;
  digest?: string;
  showDevError?: boolean;
  primaryAction: { label: string; onClick?: () => void; href?: string };
  secondaryAction: { label: string; href: string };
}

export function ErrorLayout({
  label, title, description, errorMessage, digest,
  showDevError, primaryAction, secondaryAction,
}: ErrorLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 text-center">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1E2A3A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Geometric corner decorations */}
      <div className="absolute top-[20%] left-[8%] h-px w-32 bg-accent/15" />
      <div className="absolute top-[20%] left-[8%] h-32 w-px bg-accent/15" />
      <div className="absolute bottom-[20%] right-[8%] h-px w-32 bg-silver/40" />
      <div className="absolute bottom-[20%] right-[8%] h-32 w-px bg-silver/40" />

      {/* Floating geometric shapes */}
      <div
        className="absolute top-[35%] right-[15%] h-20 w-20 border border-accent/[0.1] animate-geo-pulse"
        style={{ "--geo-rotate": "45deg" } as React.CSSProperties}
      />
      <div
        className="absolute bottom-[30%] left-[12%] h-14 w-14 border border-silver/30 animate-geo-pulse"
        style={{ "--geo-rotate": "12deg", animationDelay: "1.5s" } as React.CSSProperties}
      />
      <div
        className="absolute top-[55%] left-[25%] h-8 w-8 border border-accent/[0.06] animate-geo-pulse"
        style={{ "--geo-rotate": "-20deg", animationDelay: "3s" } as React.CSSProperties}
      />

      <div className="relative z-10">
        <FolioLogo size={28} className="text-2xl text-navy/15" />

        <p className="mt-8 text-[10px] font-semibold tracking-[0.5em] text-accent uppercase">
          {label}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-navy sm:text-6xl lg:text-7xl animate-error-glitch">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-px w-12 bg-accent/30" />
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate">
          {description}
        </p>

        {showDevError && errorMessage && (
          <div className="mx-auto mt-6 max-w-lg overflow-auto rounded-sm border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 border-b border-red-100 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="text-[10px] font-medium tracking-wider text-red-500 uppercase">
                Error details
              </span>
            </div>
            <pre className="px-5 py-3 text-left font-mono text-xs leading-relaxed text-red-600">
              {errorMessage}
            </pre>
          </div>
        )}
        {digest && (
          <p className="mt-3 font-mono text-[10px] text-steel/50">
            ID: {digest}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {primaryAction.onClick ? (
            <button
              onClick={primaryAction.onClick}
              className="min-h-[48px] rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
            >
              {primaryAction.label}
            </button>
          ) : (
            <Link
              href={primaryAction.href ?? "/"}
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
            >
              {primaryAction.label}
            </Link>
          )}
          <Link
            href={secondaryAction.href}
            className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-silver/50 px-8 py-3 text-xs tracking-[0.2em] text-slate uppercase transition-all duration-200 hover:border-navy hover:text-navy"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
