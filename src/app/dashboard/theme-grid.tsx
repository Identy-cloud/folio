"use client";

import { THEMES, ALL_FONTS } from "@/lib/templates/themes";
import { FREE_THEMES } from "@/lib/plan-limits";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";
import type { usePlanLimits } from "@/hooks/usePlanLimits";

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
            className={`group relative overflow-hidden rounded border text-left transition-shadow hover:shadow-lg disabled:opacity-50 ${
              isLocked ? "border-neutral-800 opacity-60" : "border-neutral-700"
            }`}
          >
            <div
              className="flex aspect-video items-end p-4"
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
            <div className="flex items-center justify-between px-4 py-2">
              <p className="text-xs text-neutral-400">
                {ALL_FONTS.find((f) => f.value === th.fontDisplay)?.label ??
                  th.fontDisplay}{" "}
                +{" "}
                {ALL_FONTS.find((f) => f.value === th.fontBody)?.label ??
                  th.fontBody}
              </p>
              {isLocked && (
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">
                  PRO
                </span>
              )}
            </div>
            {creating === key && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="text-xs text-neutral-400">
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
