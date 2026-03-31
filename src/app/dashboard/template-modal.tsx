"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/templates/themes";
import type { TemplateDefinition } from "@/lib/templates/template-types";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { toast } from "sonner";
import { X, CaretLeft } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { TemplateGrid } from "./template-grid";
import { TemplatePreview } from "./template-preview";
import { ThemeGrid } from "./theme-grid";
import { useWorkspace } from "./workspace-context";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "template" | "preview" | "theme";
const themeKeys = Object.keys(THEMES);

export function TemplateModal({ open, onClose }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [creating, setCreating] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const { limits } = usePlanLimits();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && creating === null) {
      if (step === "theme") setStep("preview");
      else if (step === "preview") setStep("template");
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

  async function handleCreate(themeKey: string) {
    setCreating(themeKey);
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: themeKey,
          templateId: selectedTemplate?.id,
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

  const showBack = step !== "template";
  const goBack = () => {
    if (step === "theme") setStep("preview");
    else if (step === "preview") setStep("template");
  };
  const backLabel = step === "preview" ? "Back to templates" : step === "theme" ? "Back to preview" : "";
  const title = step === "template" ? "Choose a Template" : step === "preview" ? (selectedTemplate?.name ?? "Preview") : "Choose a Theme";
  const desc = step === "template" ? "Select a layout for your presentation" : step === "preview" ? "Preview slides before choosing a theme" : "Select a color palette for your slides";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" role="dialog" aria-modal="true" aria-label={t.dashboard.newPresentation} onClick={() => creating === null && onClose()}>
      <div ref={trapRef} className="max-h-[90vh] w-full overflow-y-auto bg-slate p-4 shadow-2xl sm:max-w-4xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {showBack ? (
              <button onClick={goBack} className="flex items-center gap-1.5 text-base text-silver/70 transition-colors hover:text-white">
                <CaretLeft size={18} />
                {backLabel}
              </button>
            ) : (
              <div />
            )}
            <button onClick={onClose} disabled={creating !== null} className="p-1.5 text-silver/50 transition-colors hover:bg-white/5 hover:text-silver disabled:opacity-30" aria-label={t.common.close}>
              <X size={24} />
            </button>
          </div>
          <h2 className="mt-6 font-display text-3xl tracking-tight text-silver sm:text-4xl">{title}</h2>
          <p className="mt-1.5 text-sm text-silver/70">{desc}</p>
        </div>

        <div key={step} style={{ animation: "fade-in 0.25s ease" }}>
          {step === "template" && (
            <TemplateGrid onSelectTemplate={(tpl) => { setSelectedTemplate(tpl); setStep("preview"); }} onBlank={handleBlank} onAIGenerate={() => { onClose(); window.dispatchEvent(new CustomEvent("folio:open-ai-presentation")); }} disabled={creating !== null} creatingBlank={creating === "blank"} />
          )}
          {step === "preview" && selectedTemplate && (
            <TemplatePreview template={selectedTemplate} onConfirm={() => setStep("theme")} />
          )}
          {step === "theme" && (
            <ThemeGrid themeKeys={themeKeys} creating={creating} limits={limits} onSelect={handleCreate} />
          )}
        </div>
      </div>
    </div>
  );
}
