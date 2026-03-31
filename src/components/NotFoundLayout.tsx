import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

interface NotFoundLayoutProps {
  message: string;
  ctaLabel: string;
  ctaHref: string;
  showLogo?: boolean;
}

export function NotFoundLayout({
  message, ctaLabel, ctaHref, showLogo = true,
}: NotFoundLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-4 text-center">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Geometric corner decorations */}
      <div className="absolute top-[25%] left-[12%] h-px w-20 bg-accent/10" />
      <div className="absolute top-[25%] left-[12%] h-20 w-px bg-accent/10" />
      <div className="absolute bottom-[25%] right-[12%] h-px w-20 bg-steel/20" />
      <div className="absolute bottom-[25%] right-[12%] h-20 w-px bg-steel/20" />

      {/* Floating geometric shapes -- playful feel */}
      <div
        className="absolute top-[45%] left-[20%] h-12 w-12 border border-steel/10 animate-geo-pulse"
        style={{ "--geo-rotate": "12deg" } as React.CSSProperties}
      />
      <div
        className="absolute bottom-[35%] right-[18%] h-16 w-16 border border-accent/[0.06] animate-geo-pulse"
        style={{ "--geo-rotate": "-12deg", animationDelay: "2s" } as React.CSSProperties}
      />
      <div
        className="absolute top-[30%] right-[25%] h-6 w-6 rounded-full border border-accent/[0.08] animate-geo-pulse"
        style={{ "--geo-rotate": "0deg", animationDelay: "1s" } as React.CSSProperties}
      />

      <div className="relative z-10">
        {showLogo && <FolioLogo size={28} className="text-2xl text-white/15" />}

        <h1 className="mt-8 font-display text-[8rem] leading-none tracking-tight text-white animate-error-glitch sm:text-[12rem] lg:text-[16rem]">
          404
        </h1>
        <div className="mx-auto h-px w-16 bg-accent/40" />
        <p className="mt-6 text-[10px] tracking-[0.5em] text-accent/50 uppercase">
          Page not found
        </p>
        <p className="mt-3 text-sm text-silver/50">
          {message}
        </p>
        <Link
          href={ctaHref}
          className="mt-10 inline-flex min-h-[48px] items-center rounded-sm bg-accent px-8 py-3 text-xs font-semibold tracking-[0.25em] text-white uppercase transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
