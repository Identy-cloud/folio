"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { THEMES } from "@/lib/templates/themes";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { X, Plus, Trash } from "@phosphor-icons/react";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { FREE_THEMES, requiredPlanFor } from "@/lib/plan-limits";
import { UpgradeModal } from "@/components/UpgradeModal";
import { toast } from "sonner";
import { ThemeBuilder } from "./ThemeBuilder";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ThemeCustomizer({ open, onClose }: Props) {
  const slides = useEditorStore((s) => s.slides);
  const theme = useEditorStore((s) => s.theme);
  const customThemes = useEditorStore((s) => s.customThemes);
  const deleteCustomTheme = useEditorStore((s) => s.deleteCustomTheme);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const presentationId = useEditorStore((s) => s.presentationId);
  const { limits } = usePlanLimits();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const allThemes = { ...THEMES, ...customThemes };
  const themeObj = allThemes[theme] ?? THEMES["editorial-blue"];

  if (!open) return null;

  function applyColorToAllSlides(color: string) {
    const updated = slides.map((s) => ({ ...s, backgroundColor: color }));
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" as const });
    pushHistory();
  }

  function applyAccentToAll(accent: string) {
    const updated = slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => {
        if (el.type === "text" && el.color === themeObj.accent) return { ...el, color: accent };
        if (el.type === "shape" && el.fill === themeObj.accent) return { ...el, fill: accent };
        return el;
      }),
    }));
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" as const });
    pushHistory();
  }

  function patchPres(body: Record<string, unknown>) {
    fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }).catch(() => {});
  }

  function selectTheme(key: string) {
    if (!allThemes[key]) return;
    const isFree = (FREE_THEMES as readonly string[]).includes(key);
    if (!limits.canUseAllTemplates && !isFree && !(key in customThemes)) {
      toast.error("Upgrade your plan to use this theme"); return;
    }
    useEditorStore.setState({ theme: key, dirty: true, saveStatus: "unsaved" as const });
    patchPres({ theme: key });
  }

  function handleDeleteCustom(key: string) {
    deleteCustomTheme(key);
    const s = useEditorStore.getState();
    patchPres({ customThemes: s.customThemes, theme: s.theme });
    toast.success("Custom theme deleted");
  }

  const builtInKeys = Object.keys(THEMES);
  const customKeys = Object.keys(customThemes);

  return (
    <>
      <div className="fixed top-14 left-2 md:left-60 z-50 w-64 rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Themes</span>
          <button onClick={onClose} aria-label="Close" className="rounded p-1.5 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-colors"><X size={14} /></button>
        </div>
        <p className="text-[10px] text-neutral-600 mb-2">Current: {themeObj.label}</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {builtInKeys.map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                onClick={() => selectTheme(key)}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors ${
                  theme === key ? "bg-white text-[#161616]" : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-neutral-600 shrink-0" style={{ backgroundColor: t.accent }} />
                {t.label}
              </button>
            );
          })}
        </div>
        {customKeys.length > 0 && (
          <>
            <div className="mt-3 mb-1 text-[9px] text-neutral-600 uppercase tracking-wider">Custom</div>
            <div className="space-y-1">
              {customKeys.map((key) => {
                const t = customThemes[key];
                return (
                  <div key={key} className="flex items-center gap-1">
                    <button
                      onClick={() => selectTheme(key)}
                      className={`flex flex-1 items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors ${
                        theme === key ? "bg-white text-[#161616]" : "text-neutral-300 hover:bg-neutral-800"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-neutral-600 shrink-0" style={{ backgroundColor: t.accent }} />
                      {t.label}
                    </button>
                    <button onClick={() => handleDeleteCustom(key)} className="rounded p-1 text-neutral-600 hover:text-red-400 transition-colors">
                      <Trash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <button
          onClick={() => {
            if (!limits.canUseBrandKit) { setShowUpgrade(true); return; }
            setBuilderOpen(true);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-neutral-600 px-3 py-2 text-[11px] text-neutral-400 hover:border-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <Plus size={12} /> Create Theme
          {!limits.canUseBrandKit && <span className="text-[9px] text-amber-400 ml-1">PRO</span>}
        </button>
        <div className="mt-3 space-y-2 border-t border-neutral-700 pt-3">
          <div>
            <span className="text-[10px] text-neutral-500">Background (all slides)</span>
            <ColorPicker value={themeObj.background} onChange={applyColorToAllSlides} />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500">Accent color (all slides)</span>
            <ColorPicker value={themeObj.accent} onChange={applyAccentToAll} />
          </div>
        </div>
      </div>
      <ThemeBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Custom Themes"
        requiredPlan={requiredPlanFor("canUseBrandKit")}
      />
    </>
  );
}
