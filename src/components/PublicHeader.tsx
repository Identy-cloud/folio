"use client";

import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useTranslation } from "@/lib/i18n/context";

interface PublicHeaderProps {
  showNav?: boolean;
}

export function PublicHeader({ showNav = true }: PublicHeaderProps) {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
      <Link href="/">
        <FolioLogo size={22} className="text-navy" />
      </Link>
      <div className="flex items-center gap-5">
        <LocaleSelector />
        {showNav && (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
