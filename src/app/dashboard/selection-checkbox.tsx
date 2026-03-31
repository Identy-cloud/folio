"use client";

import { Check } from "@phosphor-icons/react";

interface Props {
  checked: boolean;
  visible: boolean;
  onChange: () => void;
  ariaLabel: string;
}

export function SelectionCheckbox({ checked, visible, onChange, ariaLabel }: Props) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange();
      }}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-all ${
        checked
          ? "border-accent bg-accent"
          : "border-silver/50 bg-white/5"
      } ${
        visible
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {checked && <Check size={14} weight="bold" className="text-white" />}
    </button>
  );
}
