"use client";

import { Notebook } from "@phosphor-icons/react";

interface Props {
  size?: number;
  className?: string;
}

export function FolioLogo({ size = 22, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-display tracking-tight ${className}`}>
      <Notebook size={size} weight="duotone" />
      FOLIO
    </span>
  );
}
