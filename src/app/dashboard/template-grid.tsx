"use client";

import { useState } from "react";
import { TEMPLATES, type TemplateCategory } from "@/lib/templates/templates";
import type { TemplateDefinition } from "@/lib/templates/template-types";
import { Plus, Sparkle } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

const CATEGORIES: { key: TemplateCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "business", label: "Business" },
  { key: "creative", label: "Creative" },
  { key: "education", label: "Education" },
  { key: "pitch", label: "Pitch" },
];

interface Props {
  onSelectTemplate: (tpl: TemplateDefinition) => void;
  onBlank: () => void;
  onAIGenerate: () => void;
  disabled: boolean;
  creatingBlank: boolean;
}

export function TemplateGrid({ onSelectTemplate, onBlank, onAIGenerate, disabled, creatingBlank }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<TemplateCategory | "all">("all");

  const filtered = category === "all"
    ? TEMPLATES
    : TEMPLATES.filter((tpl) => tpl.category === category);

  return (
    <div>
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:mb-6 sm:gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`shrink-0 px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              category === cat.key
                ? "bg-[#FAFAFA] text-navy"
                : "text-slate hover:bg-[#FAFAFA] hover:text-navy"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {filtered.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelectTemplate(tpl)}
            disabled={disabled}
            className="group relative overflow-hidden border border-silver/40 text-left transition-all hover:border-silver/50 hover:shadow-lg disabled:opacity-50"
          >
            <div className="flex aspect-video items-end bg-[#FAFAFA] p-4">
              <div>
                <p className="font-display text-xl leading-none tracking-tight text-navy">
                  {tpl.name}
                </p>
              </div>
              <span className="absolute right-3 top-3 bg-[#FAFAFA] px-2.5 py-0.5 text-xs capitalize text-slate">
                {tpl.category}
              </span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-xs leading-relaxed text-slate">
                {tpl.description}
              </p>
            </div>
          </button>
        ))}

        <button
          onClick={onAIGenerate}
          disabled={disabled}
          className="group relative overflow-hidden border border-amber-800/40 bg-amber-950/20 text-left transition-all hover:border-amber-700/60 hover:shadow-lg disabled:opacity-50"
        >
          <div className="flex aspect-video items-center justify-center">
            <div className="flex flex-col items-center">
              <Sparkle size={28} weight="fill" className="text-amber-400" />
              <span className="mt-2 block text-xs font-medium uppercase tracking-wider text-amber-300">
                Generate with AI
              </span>
            </div>
          </div>
          <div className="px-4 py-2.5">
            <p className="text-[11px] leading-relaxed text-slate">
              Describe a topic and AI creates a full presentation
            </p>
          </div>
        </button>

        <button
          onClick={onBlank}
          disabled={disabled}
          className="relative overflow-hidden border-2 border-dashed border-silver/40 text-steel transition-colors hover:border-silver/50 hover:text-navy disabled:opacity-50"
        >
          <div className="flex aspect-video items-center justify-center">
            <div className="flex flex-col items-center">
              <Plus size={28} />
              <span className="mt-2 block text-xs uppercase tracking-wider">
                {t.dashboard.blank}
              </span>
            </div>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs text-slate">{t.common.noTemplate}</p>
          </div>
          {creatingBlank && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <span className="text-xs text-silver">{t.common.creating}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
