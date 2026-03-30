"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useTranslation } from "@/lib/i18n/context";
import { LandingFeatures } from "./LandingFeatures";

export function LandingClient() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <div className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <span className="text-xl sm:text-2xl"><FolioLogo size={22} /></span>
        <div className="flex items-center gap-4">
          <LocaleSelector />
          <Link href="/pricing" className="hidden sm:block text-xs tracking-[0.15em] text-neutral-500 uppercase hover:text-white transition-colors">
            {l.navPricing}
          </Link>
          <Link
            href="/login"
            className="text-xs tracking-[0.25em] text-neutral-400 uppercase hover:text-white transition-colors"
          >
            {l.navLogin}
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
          {l.subtitle}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none tracking-tight sm:text-7xl lg:text-9xl">
          {l.heading1}
          <br />
          <span className="text-neutral-500">{l.heading2}</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-400">
          {l.description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/login"
            className="bg-white px-6 py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors sm:px-8"
          >
            {l.cta}
          </Link>
          <Link
            href="/p/xn9C3QddXu"
            className="border border-neutral-700 px-6 py-3 text-xs tracking-[0.25em] text-neutral-300 uppercase hover:border-white hover:text-white transition-colors sm:px-8"
          >
            {l.demo}
          </Link>
        </div>
      </main>

      <LandingFeatures />

      <section className="border-t border-neutral-800 px-4 py-16 text-center sm:px-8 sm:py-24">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          {l.ctaHeading}
        </h2>
        <p className="mt-4 text-sm text-neutral-500">
          {l.ctaDesc}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block bg-white px-8 py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors"
        >
          {l.ctaButton}
        </Link>
      </section>

      <footer className="border-t border-neutral-800 px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">{l.footerProduct}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/pricing" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.navPricing}
              </Link>
              <Link href="/login" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerStartFree}
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">{l.footerLegal}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/terms" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerTerms}
              </Link>
              <Link href="/privacy" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerPrivacy}
              </Link>
              <Link href="/cookies" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerCookies}
              </Link>
              <Link href="/dmca" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerDmca}
              </Link>
              <Link href="/accessibility" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerAccessibility}
              </Link>
              <Link href="/privacy#ccpa" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerDoNotSell}
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">{l.footerCompany}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="mailto:hello@identy.cloud" className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase hover:text-neutral-200 transition-colors">
                {l.footerContact}
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          {l.footer}
        </p>
      </footer>
    </div>
  );
}
