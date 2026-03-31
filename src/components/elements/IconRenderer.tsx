"use client";

import type { IconElement } from "@/types/elements";
import { getIconByName } from "@/lib/icon-map";

interface Props {
  element: IconElement;
}

export function IconRenderer({ element }: Props) {
  const entry = getIconByName(element.iconName);
  if (!entry) {
    return (
      <div className="flex h-full w-full items-center justify-center text-silver/50">
        <span className="text-xs">?</span>
      </div>
    );
  }

  const IconComponent = entry.component;
  const size = Math.min(element.w, element.h);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <IconComponent
        size={size}
        weight={element.iconWeight}
        color={element.color}
      />
    </div>
  );
}
