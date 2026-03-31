"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useTranslation } from "@/lib/i18n/context";
import { LandingFeatures } from "./LandingFeatures";
import { LandingStats } from "./LandingStats";
import { LandingTestimonials } from "./LandingTestimonials";
import { LandingTrustedBy } from "./LandingTrustedBy";
import { LandingComparison } from "./LandingComparison";
import { LandingHero } from "./LandingHero";
import { LandingCta } from "./LandingCta";
import { LandingFooter } from "./LandingFooter";

export function LandingClient() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <div className="flex min-h-screen flex-col bg-white text-navy">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <FolioLogo size={22} className="text-navy" />
        <div className="flex items-center gap-5">
          <LocaleSelector />
          <Link
            href="/pricing"
            className="hidden text-[11px] font-semibold tracking-[0.15em] text-slate uppercase hover:text-navy transition-colors sm:block"
          >
            {l.navPricing}
          </Link>
          <Link
            href="/login"
            className="bg-navy px-5 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase hover:bg-slate transition-colors"
          >
            {l.navLogin}
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 flex-col">
        <LandingHero />
        <LandingTrustedBy />
        <LandingFeatures />
        <LandingStats />
        <LandingComparison />
        <LandingTestimonials />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
