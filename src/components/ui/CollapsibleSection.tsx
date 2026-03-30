"use client";

import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1 cursor-pointer"
      >
        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        <CaretDown
          size={12}
          className={`text-neutral-500 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
          open ? "max-h-[800px]" : "max-h-0"
        }`}
      >
        <div className="pt-1">{children}</div>
      </div>
    </div>
  );
}
