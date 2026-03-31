"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { FolioLogo } from "@/components/FolioLogo";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useTranslation } from "@/lib/i18n/context";

interface PublicHeaderProps {
  showNav?: boolean;
}

export function PublicHeader({ showNav = true }: PublicHeaderProps) {
  const { t } = useTranslation();
  const l = t.landing;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
      <div className="flex items-center justify-between">
        <Link href="/">
          <FolioLogo size={22} className="text-navy" />
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="hidden md:block">
            <LocaleSelector />
          </div>

          {showNav && (
            <>
              <Link
                href="/pricing"
                className="hidden text-[11px] font-semibold tracking-[0.15em] text-steel uppercase transition-colors hover:text-navy md:block"
              >
                {l.navPricing}
              </Link>
              <Link
                href="/login"
                className="hidden bg-navy px-5 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-slate md:block"
              >
                {l.navLogin}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-11 w-11 items-center justify-center text-navy md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
              </button>
            </>
          )}

          {!showNav && (
            <div className="md:hidden">
              <LocaleSelector />
            </div>
          )}
        </div>
      </div>

      {showNav && mobileOpen && (
        <nav className="flex flex-col gap-2 border-t border-silver/30 pt-4 mt-4 md:hidden">
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 items-center text-[11px] font-semibold tracking-[0.15em] text-steel uppercase transition-colors hover:text-navy"
          >
            {l.navPricing}
          </Link>
          <div className="h-px bg-silver/20" />
          <div className="flex items-center justify-between">
            <LocaleSelector />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="bg-navy px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-slate"
            >
              {l.navLogin}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
