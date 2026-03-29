"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { THEMES, ALL_FONTS } from "@/lib/templates/themes";
import { TEMPLATES } from "@/lib/templates/templates";
import { FREE_THEMES } from "@/lib/plan-limits";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { toast } from "sonner";
import { X, Plus, ArrowLeft, Check } from "@phosphor-icons/react";
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
  const [step, setStep] = useState<"template" | "theme">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const { limits } = usePlanLimits();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && creating === null) {
      if (step === "theme") setStep("template");
      else onClose();
    }
  }, [onClose, creating, step]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) { setStep("template"); setSelectedTemplate(null); }
  }, [open]);

  if (!open) return null;

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplate(templateId);
    setStep("theme");
  }

  async function handleCreate(themeKey: string) {
    setCreating(themeKey);
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: themeKey,
          templateId: selectedTemplate,
          useTemplate: selectedTemplate !== null,
        }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/editor/${p.id}`);
        router.refresh();
      } else if (res.status === 403) {
        toast.error(t.dashboard.planLimitReached ?? "Plan limit reached");
        setCreating(null);
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
      } else if (res.status === 403) {
        toast.error(t.dashboard.planLimitReached ?? "Plan limit reached");
        setCreating(null);
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
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-3">
            {step === "theme" && (
              <button
                onClick={() => setStep("template")}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="font-display text-2xl tracking-tight text-neutral-200 sm:text-3xl">
                {step === "template" ? "Choose a Template" : "Choose a Theme"}
              </h2>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                {step === "template"
                  ? "Select a layout for your presentation"
                  : `Applying to: ${TEMPLATES.find((t) => t.id === selectedTemplate)?.name ?? "Blank"}`}
              </p>
            </div>
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

        {/* Step 1: Template selection */}
        {step === "template" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id)}
                disabled={creating !== null}
                className="group relative overflow-hidden rounded border border-neutral-700 text-left transition-all hover:border-neutral-500 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex aspect-video items-end bg-neutral-900 p-4">
                  <div>
                    <p className="font-display text-xl leading-none text-white tracking-tight">
                      {tpl.name}
                    </p>
                    <p className="mt-1.5 text-[10px] text-neutral-500">
                      {tpl.slideCount} slides
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2.5">
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              </button>
            ))}

            {/* Blank */}
            <button
              onClick={handleBlank}
              disabled={creating !== null}
              className="relative overflow-hidden rounded border-2 border-dashed border-neutral-700 text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-300 disabled:opacity-50"
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
        )}

        {/* Step 2: Theme selection */}
        {step === "theme" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {themeKeys.map((key) => {
              const th = THEMES[key];
              const isFree = (FREE_THEMES as readonly string[]).includes(key);
              const isLocked = !limits.canUseAllTemplates && !isFree;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isLocked) { toast.error("Upgrade your plan to use this theme"); return; }
                    handleCreate(key);
                  }}
                  disabled={creating !== null}
                  className={`group relative overflow-hidden rounded border text-left transition-shadow hover:shadow-lg disabled:opacity-50 ${isLocked ? "border-neutral-800 opacity-60" : "border-neutral-700"}`}
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
                      <div className="mt-2 h-0.5 w-8" style={{ backgroundColor: th.accent }} />
                    </div>
                    <div className="absolute right-4 top-4 h-6 w-6 rounded-full" style={{ backgroundColor: th.accent }} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <p className="text-xs text-neutral-400">
                      {ALL_FONTS.find((f) => f.value === th.fontDisplay)?.label ?? th.fontDisplay} +{" "}
                      {ALL_FONTS.find((f) => f.value === th.fontBody)?.label ?? th.fontBody}
                    </p>
                    {isLocked && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-400">PRO</span>
                    )}
                  </div>
                  {creating === key && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <span className="text-xs text-neutral-400">{t.common.creating}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
