import Link from "next/link";
import { FolioLogo } from "@/components/FolioLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center">
      <FolioLogo size={28} className="text-2xl text-white/20" />
      <h1 className="mt-8 font-display text-8xl tracking-tight text-white sm:text-[12rem]">
        404
      </h1>
      <p className="mt-4 text-sm text-silver/50">
        This page doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-8 bg-accent px-6 py-3 text-xs font-semibold tracking-[0.25em] text-white uppercase hover:bg-accent-hover transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
