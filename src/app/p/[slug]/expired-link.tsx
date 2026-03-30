"use client";

import Link from "next/link";

export function ExpiredLink() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center">
      <p className="font-display text-sm tracking-[0.3em] text-neutral-600 uppercase">
        Link expired
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
        This link has expired
      </h1>
      <p className="mt-4 max-w-md text-sm text-neutral-500 md:text-base">
        The share link for this presentation is no longer valid.
        Contact the owner for a new link.
      </p>
      <Link
        href="/"
        className="mt-8 rounded bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
      >
        Go to Folio
      </Link>
    </div>
  );
}
