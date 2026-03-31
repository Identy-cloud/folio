"use client";

import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";
import { LocaleSelector } from "@/components/LocaleSelector";

interface Props {
  emailDigest: boolean;
  onToggleDigest: (next: boolean) => void;
}

export function PreferencesSection({ emailDigest, onToggleDigest }: Props) {
  const { t } = useTranslation();

  async function handleToggle() {
    const next = !emailDigest;
    onToggleDigest(next);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailDigest: next }),
    });
    if (res.ok) {
      toast.success(next ? "Digest enabled" : "Digest disabled");
    } else {
      onToggleDigest(!next);
      toast.error(t.common.error);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
        Preferencias
      </p>
      <div className="border border-steel/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-silver">Idioma</p>
            <p className="mt-0.5 text-[11px] text-silver/50">Cambia el idioma de la interfaz</p>
          </div>
          <LocaleSelector />
        </div>
      </div>
      <div className="border border-steel/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-silver">Email semanal de analytics</p>
            <p className="mt-0.5 text-[11px] text-silver/50">
              Resumen de vistas de tus presentaciones cada lunes
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              emailDigest ? "bg-accent" : "bg-steel"
            }`}
            role="switch"
            aria-checked={emailDigest}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-navy transition-transform ${
                emailDigest ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
