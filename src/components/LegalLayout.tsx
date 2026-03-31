"use client";

import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

interface LegalLayoutProps {
  label: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ label, title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-navy">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-20">
        <p className="text-[10px] font-semibold tracking-[0.5em] text-accent uppercase">
          {label}
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="mx-0 mt-3 h-px w-12 bg-accent/40" />
        <p className="mt-4 text-sm text-steel">
          {lastUpdated}
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-slate">
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export function LegalSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-display text-lg tracking-tight text-navy">
      {children}
    </h2>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-inside list-disc space-y-1 text-steel">
      {children}
    </ul>
  );
}

export function LegalListDetailed({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-inside list-disc space-y-2 text-steel">
      {children}
    </ul>
  );
}

export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="text-navy underline underline-offset-4 hover:text-accent transition-colors"
    >
      {children}
    </a>
  );
}
