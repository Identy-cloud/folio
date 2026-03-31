"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";
import { useTranslation } from "@/lib/i18n/context";

export function PublicFooter() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <footer className="relative bg-[#FAFAFA] px-5 pt-14 pb-12 sm:px-8 sm:pt-18 sm:pb-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-12">
        <div className="col-span-2 sm:col-span-1">
          <FolioLogo size={20} className="text-navy" />
          <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-steel">
            Presentations crafted to impress.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
            {l.footerProduct}
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link href="/pricing" className="text-xs text-slate transition-colors hover:text-accent">
              {l.navPricing}
            </Link>
            <Link href="/login" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerStartFree}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
            {l.footerLegal}
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link href="/terms" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerTerms}
            </Link>
            <Link href="/privacy" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerPrivacy}
            </Link>
            <Link href="/cookies" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerCookies}
            </Link>
            <Link href="/dmca" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerDmca}
            </Link>
            <Link href="/accessibility" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerAccessibility}
            </Link>
            <Link href="/privacy#ccpa" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerDoNotSell}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-navy uppercase">
            {l.footerCompany}
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <a href="mailto:hello@identy.cloud" className="text-xs text-slate transition-colors hover:text-accent">
              {l.footerContact}
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-silver/40 pt-6">
        <p className="text-center text-[10px] tracking-[0.3em] text-steel/50 uppercase">
          {l.footer}
        </p>
      </div>
    </footer>
  );
}
