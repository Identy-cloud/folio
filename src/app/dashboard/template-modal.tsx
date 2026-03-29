"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { THEMES, ALL_FONTS } from "@/lib/templates/themes";
import { toast } from "sonner";
import { X, Plus } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface Props {
  open: boolean;
  onClose: () => void;
}

const themeKeys = Object.keys(THEMES);

export function TemplateModal({ open, onClose }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [creating, setCreating] = useState<string | null>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && creating === null) onClose();
  }, [onClose, creating]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  async function handleSelect(themeKey: string) {
    setCreating(themeKey);
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeKey, useTemplate: true }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/editor/${p.id}`);
        router.refresh();
      } else {
        toast.error(t.dashboard.errorCreate);
        setCreating(null);
      }
    } catch {
      toast.error(t.common.connectionError);
      setCreating(null);
    }
  }

  async function handleBlank() {
    setCreating("blank");
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useTemplate: false }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/editor/${p.id}`);
        router.refresh();
      } else {
        toast.error(t.dashboard.errorCreate);
        setCreating(null);
      }
    } catch {
      toast.error(t.common.connectionError);
      setCreating(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" role="dialog" aria-modal="true" aria-label={t.dashboard.newPresentation} onClick={() => creating === null && onClose()}>
      <div ref={trapRef} className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-[#1e1e1e] p-4 shadow-2xl sm:max-w-4xl sm:rounded-sm sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-neutral-200 sm:text-3xl">
              {t.dashboard.newPresentation}
            </h2>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              {t.dashboard.chooseTheme}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={creating !== null}
            className="text-neutral-500 hover:text-neutral-200 disabled:opacity-30"
            aria-label={t.common.close}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {themeKeys.map((key) => {
            const th = THEMES[key];
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={creating !== null}
                className="group relative overflow-hidden border border-neutral-700 text-left transition-shadow hover:shadow-lg disabled:opacity-50"
              >
                <div
                  className="flex aspect-video items-end p-4"
                  style={{ backgroundColor: th.background }}
                >
                  <div>
                    <p
                      className="text-2xl leading-none"
                      style={{
                        fontFamily: th.fontDisplay,
                        color: th.text,
                      }}
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
                <div className="px-4 py-2">
                  <p className="text-xs text-neutral-400">
                    {ALL_FONTS.find((f) => f.value === th.fontDisplay)?.label ?? th.fontDisplay} +{" "}
                    {ALL_FONTS.find((f) => f.value === th.fontBody)?.label ?? th.fontBody}
                  </p>
                </div>
                {creating === key && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <span className="text-xs text-neutral-400">{t.common.creating}</span>
                  </div>
                )}
              </button>
            );
          })}

          <button
            onClick={handleBlank}
            disabled={creating !== null}
            className="relative overflow-hidden border-2 border-dashed border-neutral-700 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300 disabled:opacity-50"
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
              <p className="text-xs text-neutral-400">{t.common.noTemplate}</p>
            </div>
            {creating === "blank" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="text-xs text-neutral-400">{t.common.creating}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
