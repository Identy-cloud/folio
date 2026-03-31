"use client";

import { Check, X, Lock } from "@phosphor-icons/react";
import Link from "next/link";

interface Feature {
  label: string;
  enabled: boolean;
}

const PLAN_FEATURES: Record<string, Feature[]> = {
  free: [
    { label: "3 presentaciones", enabled: true },
    { label: "100 MB almacenamiento", enabled: true },
    { label: "1 tema", enabled: true },
    { label: "Exportar imagen", enabled: true },
    { label: "Marca de agua", enabled: true },
    { label: "Exportar PDF", enabled: false },
    { label: "Exportar PPTX", enabled: false },
    { label: "Colaboracion", enabled: false },
    { label: "Temas premium", enabled: false },
    { label: "AI", enabled: false },
    { label: "Analytics", enabled: false },
    { label: "Dominio custom", enabled: false },
  ],
  creator: [
    { label: "Presentaciones ilimitadas", enabled: true },
    { label: "10 GB almacenamiento", enabled: true },
    { label: "Todos los temas", enabled: true },
    { label: "Sin marca de agua", enabled: true },
    { label: "Exportar PDF", enabled: true },
    { label: "AI (generar slides, traducir, imagenes)", enabled: true },
    { label: "Analytics", enabled: true },
    { label: "Grabacion", enabled: true },
    { label: "Dominio custom", enabled: true },
    { label: "50 versiones por presentacion", enabled: true },
    { label: "Exportar PPTX", enabled: false },
    { label: "Colaboracion realtime", enabled: false },
    { label: "Brand kit", enabled: false },
  ],
  studio: [
    { label: "Presentaciones ilimitadas", enabled: true },
    { label: "50 GB almacenamiento", enabled: true },
    { label: "Todo de Creator +", enabled: true },
    { label: "Exportar PPTX", enabled: true },
    { label: "Colaboracion realtime (5 usuarios)", enabled: true },
    { label: "Brand kit", enabled: true },
    { label: "Fuentes custom", enabled: true },
    { label: "Dominio custom", enabled: true },
    { label: "Multi-workspace", enabled: false },
    { label: "White label", enabled: false },
    { label: "Analytics avanzados", enabled: false },
  ],
  agency: [
    { label: "Presentaciones ilimitadas", enabled: true },
    { label: "200 GB almacenamiento", enabled: true },
    { label: "Todo de Studio +", enabled: true },
    { label: "Colaboradores ilimitados", enabled: true },
    { label: "Multi-workspace", enabled: true },
    { label: "White label", enabled: true },
    { label: "Analytics avanzados", enabled: true },
    { label: "Soporte prioritario", enabled: true },
  ],
};

interface Props {
  plan: string;
}

export function PlanFeaturesSection({ plan }: Props) {
  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free;
  const hasLocked = features.some((f) => !f.enabled);

  return (
    <div className="border border-silver/30 p-4">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-steel">
        Tu plan incluye
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            {f.enabled ? (
              <Check size={12} weight="bold" className="shrink-0 text-green-600" />
            ) : (
              <Lock size={12} className="shrink-0 text-steel/60" />
            )}
            <span className={`text-xs ${f.enabled ? "text-slate" : "text-steel/60"}`}>
              {f.label}
            </span>
          </div>
        ))}
      </div>
      {hasLocked && (
        <Link
          href="/pricing"
          className="mt-3 inline-block text-[11px] text-steel hover:text-navy transition-colors"
        >
          Upgrade para desbloquear todo →
        </Link>
      )}
    </div>
  );
}
