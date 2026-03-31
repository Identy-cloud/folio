"use client";

import { Presentation, Sparkle, Users, Layout } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

interface EmptyStateProps {
  onOpenTemplates: () => void;
  onOpenAI: () => void;
}

export function EmptyState({ onOpenTemplates, onOpenAI }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-silver/30 to-silver/50 shadow-lg shadow-silver/20 sm:h-28 sm:w-28">
        <Presentation size={48} weight="thin" className="text-steel" />
      </div>

      <h2 className="font-display text-3xl tracking-tight text-navy sm:text-5xl">
        {t.dashboard.emptyHeadline}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-slate sm:text-base">
        {t.dashboard.emptySubtitle}
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={onOpenTemplates}
          className="flex items-center justify-center gap-2 bg-accent px-8 py-3.5 text-sm font-medium tracking-widest text-white uppercase transition-colors hover:bg-accent-hover"
        >
          <Layout size={16} weight="bold" />
          {t.dashboard.emptyFromTemplate}
        </button>
        <button
          onClick={onOpenAI}
          className="flex items-center justify-center gap-2 border border-silver/50 px-8 py-3.5 text-sm font-medium tracking-widest text-slate uppercase transition-colors hover:border-navy/30 hover:bg-[#FAFAFA]"
        >
          <Sparkle size={16} weight="bold" />
          {t.dashboard.emptyGenerateAI}
        </button>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-steel sm:gap-8">
        <span className="flex items-center gap-1.5">
          <Layout size={14} className="text-steel/60" />
          {t.dashboard.emptyFeature1}
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkle size={14} className="text-steel/60" />
          {t.dashboard.emptyFeature2}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-steel/60" />
          {t.dashboard.emptyFeature3}
        </span>
      </div>
    </div>
  );
}
