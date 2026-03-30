"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Copy, Check } from "@phosphor-icons/react";

interface Props {
  username: string;
}

export function PortfolioLinkSection({ username }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
    setCopied(true);
    toast.success("URL copiada");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-neutral-800 p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        Portfolio publico
      </p>
      <div className="mt-2 flex items-center gap-2">
        <p className="flex-1 truncate text-sm text-neutral-300">
          {typeof window !== "undefined" ? window.location.origin : ""}/u/{username}
        </p>
        <button
          onClick={copy}
          aria-label="Copy URL"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <Link
          href={`/u/${username}`}
          target="_blank"
          className="text-xs tracking-[0.15em] text-neutral-500 uppercase hover:text-white transition-colors"
        >
          Ver
        </Link>
      </div>
    </div>
  );
}
