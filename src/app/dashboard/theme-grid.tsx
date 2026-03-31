"use client";

import { THEMES } from "@/lib/templates/themes";
import { FREE_THEMES } from "@/lib/plan-limits";
import { toast } from "sonner";
import { Lock } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import type { usePlanLimits } from "@/hooks/usePlanLimits";

const THEME_DESCRIPTIONS: Record<string, string> = {
  "editorial-blue": "Bold headlines, clean agency feel",
  monochrome: "Elegant black & white contrast",
  "dark-editorial": "Modern dark with industrial edge",
  "warm-magazine": "Classic editorial warmth",
  "swiss-minimal": "Clean Swiss-style typography",
};

interface Props {
  themeKeys: string[];
  creating: string | null;
  limits: ReturnType<typeof usePlanLimits>["limits"];
  onSelect: (key: string) => void;
}

export function ThemeGrid({ themeKeys, creating, limits, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {themeKeys.map((key) => {
        const th = THEMES[key];
        const isFree = (FREE_THEMES as readonly string[]).includes(key);
        const isLocked = !limits.canUseAllTemplates && !isFree;
        return (
          <button
            key={key}
            onClick={() => {
              if (isLocked) {
                toast.error("Upgrade your plan to use this theme");
                return;
              }
              onSelect(key);
            }}
            disabled={creating !== null}
            className={`group relative overflow-hidden border text-left transition-shadow hover:shadow-lg disabled:opacity-50 ${
              isLocked ? "border-silver/30" : "border-silver/40"
            }`}
          >
            <div
              className={`flex aspect-video items-end p-4 ${isLocked ? "opacity-50" : ""}`}
              style={{ backgroundColor: th.background }}
            >
              <div>
                <p
                  className="text-2xl leading-none"
                  style={{ fontFamily: th.fontDisplay, color: th.text }}
                >
                  {th.label}
                </p>
                <div
                  className="mt-2 h-0.5 w-8"
                  style={{ backgroundColor: th.accent }}
                />
              </div>
              <div
                className="absolute right-4 top-4 h-6 w-6 rounded-full"
                style={{ backgroundColor: th.accent }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <p className="truncate text-sm text-slate">
                {THEME_DESCRIPTIONS[key] ?? th.label}
              </p>
              {isLocked && (
                <span className="flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  <Lock size={10} weight="fill" />
                  PRO
                </span>
              )}
            </div>
            {creating === key && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="text-xs text-silver">
                  {t.common.creating}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
