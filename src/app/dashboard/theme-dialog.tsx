"use client";

import { THEMES } from "@/lib/templates/themes";
import { FREE_THEMES } from "@/lib/plan-limits";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { useTranslation } from "@/lib/i18n/context";
import { DialogShell } from "@/components/ui/DialogShell";
import { toast } from "sonner";

const themeKeys = Object.keys(THEMES);

interface Props {
  open: boolean;
  currentTheme: string;
  onSelect: (theme: string) => void;
  onCancel: () => void;
}

export function ThemeDialog({ open, currentTheme, onSelect, onCancel }: Props) {
  const { t } = useTranslation();
  const { limits } = usePlanLimits();

  return (
    <DialogShell
      open={open}
      ariaLabel={t.dashboard.themeTitle}
      onClose={onCancel}
      className="w-full max-w-xs rounded bg-slate border border-steel p-5 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-silver">{t.dashboard.themeTitle}</h3>
      <div className="mt-3 space-y-1.5">
        {themeKeys.map((key) => {
          const th = THEMES[key];
          const isFree = (FREE_THEMES as readonly string[]).includes(key);
          const isLocked = !limits.canUseAllTemplates && !isFree;
          return (
            <button
              key={key}
              onClick={() => {
                if (isLocked) { toast.error("Upgrade your plan to use this theme"); return; }
                onSelect(key);
              }}
              className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors ${
                currentTheme === key
                  ? "bg-accent text-white"
                  : "text-silver hover:bg-white/5"
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-steel/60"
                style={{ backgroundColor: th.accent }}
              />
              {th.label}
              {isLocked && <span className="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">PRO</span>}
            </button>
          );
        })}
      </div>
      <button
        onClick={onCancel}
        className="mt-4 w-full rounded px-4 py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
      >
        {t.common.cancel}
      </button>
    </DialogShell>
  );
}
