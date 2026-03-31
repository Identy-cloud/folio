"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useTranslation } from "@/lib/i18n/context";

const legalLinks = [
  { href: "/terms", key: "footerTerms" },
  { href: "/privacy", key: "footerPrivacy" },
  { href: "/cookies", key: "footerCookies" },
  { href: "/dmca", key: "footerDmca" },
  { href: "/accessibility", key: "footerAccessibility" },
  { href: "/privacy#ccpa", key: "footerDoNotSell" },
] as const;

const productLinks = [
  { href: "/pricing", key: "navPricing" },
  { href: "/templates", key: "footerTemplates" },
  { href: "/themes", key: "footerThemes" },
  { href: "/changelog", key: "footerChangelog" },
  { href: "/status", key: "footerStatus" },
] as const;

const resourceLinks = [
  { href: "/help", key: "footerHelp" },
  { href: "/blog", key: "footerBlog" },
  { href: "/api", key: "footerApi" },
  { href: "mailto:hello@identy.cloud", key: "footerContact" },
] as const;

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">{title}</p>
      <span className="mt-2 block h-px w-10 bg-gradient-to-r from-accent/50 to-transparent" />
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function PublicFooter() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <footer className="relative overflow-hidden bg-[#FAFAFA] px-5 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-accent/[0.03] to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0A192F 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(10,25,47,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,76,41,0.03),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Mini CTA */}
        <div className="mb-12 flex flex-col items-center gap-4 rounded-2xl border border-silver/30 bg-white/60 px-6 py-8 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-navy">{l.ctaHeading}</p>
            <p className="mt-1 text-xs text-steel">{l.ctaDesc}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent/90"
          >
            {l.footerStartFree}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Main grid */}
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-12 lg:gap-20">
          {/* Brand column */}
          <div className="sm:min-w-[180px] lg:min-w-[220px]">
            <FolioLogo size={20} className="text-navy" />
            <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-steel">
              {l.footerTagline}
            </p>
            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="flex h-8 w-8 items-center justify-center rounded-full border border-silver/40 text-steel transition-colors hover:border-accent hover:text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-8 w-8 items-center justify-center rounded-full border border-silver/40 text-steel transition-colors hover:border-accent hover:text-accent">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full border border-silver/40 text-steel transition-colors hover:border-accent hover:text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
            <FooterColumn title={l.footerProduct}>
              {productLinks.map(({ href, key }) => (
                <Link key={key} href={href} className="text-xs text-slate transition-colors hover:text-accent">
                  {l[key]}
                </Link>
              ))}
            </FooterColumn>

            <FooterColumn title={l.footerResources}>
              {resourceLinks.map(({ href, key }) => (
                key === "footerContact" ? (
                  <a key={key} href={href} className="text-xs text-slate transition-colors hover:text-accent">{l[key]}</a>
                ) : (
                  <Link key={key} href={href} className="text-xs text-slate transition-colors hover:text-accent">{l[key]}</Link>
                )
              ))}
            </FooterColumn>

            <FooterColumn title={l.footerCompany}>
              <a href="mailto:hello@identy.cloud" className="text-xs text-slate transition-colors hover:text-accent">{l.footerContact}</a>
              <Link href="/blog" className="text-xs text-slate transition-colors hover:text-accent">{l.footerBlog}</Link>
              <Link href="/changelog" className="text-xs text-slate transition-colors hover:text-accent">{l.footerChangelog}</Link>
            </FooterColumn>

            <FooterColumn title={l.footerLegal}>
              {legalLinks.map(({ href, key }) => (
                <Link key={key} href={href} className="text-xs text-slate transition-colors hover:text-accent">
                  {l[key]}
                </Link>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-silver/40 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-[10px] tracking-[0.3em] text-steel/50 uppercase">
              {l.footer} &middot; &copy; {new Date().getFullYear()}
            </p>
            <LocaleSelector />
            <p className="text-[10px] tracking-[0.2em] text-steel/40 uppercase">
              {l.footerMadeWith} <span className="text-accent">&hearts;</span> Identy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
