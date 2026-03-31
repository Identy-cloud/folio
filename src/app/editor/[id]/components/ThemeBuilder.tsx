"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { X } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { requiredPlanFor } from "@/lib/plan-limits";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { ThemeBuilderPreview } from "./ThemeBuilderPreview";
import { ThemeBuilderFonts } from "./ThemeBuilderFonts";
import type { Theme } from "@/lib/templates/themes";
import { DialogShell } from "@/components/ui/DialogShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_THEME: Theme = {
  primary: "#1a1aff",
  background: "#f5f5f0",
  text: "#0a0a0a",
  accent: "#1a1aff",
  fontDisplay: "var(--font-bebas-neue)",
  fontBody: "var(--font-dm-sans)",
  label: "",
};

export function ThemeBuilder({ open, onClose }: Props) {
  const { limits } = usePlanLimits();
  const presentationId = useEditorStore((s) => s.presentationId);
  const addCustomTheme = useEditorStore((s) => s.addCustomTheme);
  const [draft, setDraft] = useState<Theme>({ ...DEFAULT_THEME });
  const [saving, setSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  function update(field: keyof Theme, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!draft.label.trim()) {
      toast.error("Enter a theme name");
      return;
    }
    if (!limits.canUseBrandKit) {
      setShowUpgrade(true);
      return;
    }
    setSaving(true);
    const key = `custom-${nanoid(8)}`;
    const theme: Theme = { ...draft, label: draft.label.trim() };
    const store = useEditorStore.getState();
    const updatedThemes = { ...store.customThemes, [key]: theme };

    try {
      const res = await fetch(`/api/presentations/${presentationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customThemes: updatedThemes, theme: key }),
      });
      if (!res.ok) throw new Error("Failed to save");
      addCustomTheme(key, theme);
      useEditorStore.setState({ theme: key });
      toast.success(`Theme "${theme.label}" created`);
      setDraft({ ...DEFAULT_THEME });
      onClose();
    } catch {
      toast.error("Failed to save theme");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogShell open={open} ariaLabel="Create custom theme" onClose={onClose}>
      <div className="w-full max-w-sm rounded bg-slate border border-steel p-4 shadow-xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-silver/70 uppercase tracking-wider">
            Create Theme
          </span>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-silver/50 hover:bg-steel hover:text-silver transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <ThemeBuilderPreview theme={draft} />

        <div className="mt-3">
          <input
            value={draft.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="Theme name"
            className="w-full rounded border border-steel bg-navy px-2 py-1.5 text-[11px] text-silver outline-none focus:border-silver/50"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <ColorPicker label="Primary" value={draft.primary} onChange={(c) => update("primary", c)} />
          <ColorPicker label="Accent" value={draft.accent} onChange={(c) => update("accent", c)} />
          <ColorPicker label="Background" value={draft.background} onChange={(c) => update("background", c)} />
          <ColorPicker label="Text" value={draft.text} onChange={(c) => update("text", c)} />
        </div>

        <div className="mt-3">
          <ThemeBuilderFonts
            fontDisplay={draft.fontDisplay}
            fontBody={draft.fontBody}
            onChangeDisplay={(v) => update("fontDisplay", v)}
            onChangeBody={(v) => update("fontBody", v)}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded px-3 py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !limits.canUseBrandKit}
            className="flex-1 rounded bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-40 transition-colors"
          >
            {saving ? "Saving..." : !limits.canUseBrandKit ? "Studio+" : "Save & Apply"}
          </button>
        </div>
      </div>
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Custom Themes"
        requiredPlan={requiredPlanFor("canUseBrandKit")}
      />
    </DialogShell>
  );
}
