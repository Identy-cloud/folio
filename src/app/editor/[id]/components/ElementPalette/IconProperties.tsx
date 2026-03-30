"use client";

import { useEditorStore } from "@/store/editorStore";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { getIconByName } from "@/lib/icon-map";
import type { IconElement, IconWeight } from "@/types/elements";

interface Props {
  element: IconElement;
}

const WEIGHTS: { value: IconWeight; label: string }[] = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "bold", label: "Bold" },
  { value: "fill", label: "Fill" },
  { value: "duotone", label: "Duotone" },
];

export function IconProperties({ element }: Props) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  function update(u: Partial<IconElement>) {
    updateElement(element.id, u);
    pushHistory();
  }

  const entry = getIconByName(element.iconName);
  const IconComponent = entry?.component;

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Icon</span>

      {IconComponent && (
        <div className="flex items-center gap-2 rounded border border-neutral-800 px-3 py-2">
          <IconComponent size={20} weight={element.iconWeight} color={element.color} />
          <span className="text-xs text-neutral-300">{entry.label}</span>
        </div>
      )}

      <div>
        <span className="mb-1 block text-[10px] text-neutral-500">Weight</span>
        <div className="grid grid-cols-3 gap-1">
          {WEIGHTS.map((w) => (
            <button
              key={w.value}
              onClick={() => update({ iconWeight: w.value })}
              className={`rounded px-2 py-1 text-[10px] transition-colors ${
                element.iconWeight === w.value
                  ? "bg-white text-[#161616]"
                  : "text-neutral-500 hover:bg-neutral-800"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <ColorPicker label="Color" value={element.color} onChange={(c) => update({ color: c })} />
    </div>
  );
}
