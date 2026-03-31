"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { DownloadSimple } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

export function DataPrivacySection() {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account");
      if (!res.ok) { toast.error(t.common.error); return; }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `folio-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setExporting(false);
    }
  }, [t]);

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-steel">
        Datos y privacidad
      </p>
      <div className="border border-silver/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate">{t.dashboard.exportData ?? "Exportar mis datos"}</p>
            <p className="mt-0.5 text-[11px] text-steel">
              {t.dashboard.exportDataDesc ?? "Descarga todos tus datos en JSON (GDPR)"}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex shrink-0 items-center gap-2 border border-silver/40 px-3 py-1.5 text-xs font-medium tracking-widest text-slate uppercase hover:border-navy hover:text-navy transition-colors disabled:opacity-30"
          >
            <DownloadSimple size={14} />
            {exporting ? "..." : (t.dashboard.exportAction ?? "Exportar")}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
        <Link href="/terms" className="text-[11px] text-steel/60 hover:text-slate transition-colors">
          Terminos de servicio
        </Link>
        <Link href="/privacy" className="text-[11px] text-steel/60 hover:text-slate transition-colors">
          Politica de privacidad
        </Link>
        <Link href="/cookies" className="text-[11px] text-steel/60 hover:text-slate transition-colors">
          Cookies
        </Link>
        <Link href="/dmca" className="text-[11px] text-steel/60 hover:text-slate transition-colors">
          DMCA
        </Link>
        <Link href="/accessibility" className="text-[11px] text-steel/60 hover:text-slate transition-colors">
          Accesibilidad
        </Link>
      </div>
    </div>
  );
}
