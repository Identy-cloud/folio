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
      <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
        Datos y privacidad
      </p>
      <div className="border border-steel/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-silver">{t.dashboard.exportData ?? "Exportar mis datos"}</p>
            <p className="mt-0.5 text-[11px] text-silver/50">
              {t.dashboard.exportDataDesc ?? "Descarga todos tus datos en JSON (GDPR)"}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex shrink-0 items-center gap-2 border border-steel px-3 py-1.5 text-xs font-medium tracking-widest text-silver uppercase hover:border-white hover:text-white transition-colors disabled:opacity-30"
          >
            <DownloadSimple size={14} />
            {exporting ? "..." : (t.dashboard.exportAction ?? "Exportar")}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
        <Link href="/terms" className="text-[11px] text-silver/40 hover:text-silver/70 transition-colors">
          Terminos de servicio
        </Link>
        <Link href="/privacy" className="text-[11px] text-silver/40 hover:text-silver/70 transition-colors">
          Politica de privacidad
        </Link>
        <Link href="/cookies" className="text-[11px] text-silver/40 hover:text-silver/70 transition-colors">
          Cookies
        </Link>
        <Link href="/dmca" className="text-[11px] text-silver/40 hover:text-silver/70 transition-colors">
          DMCA
        </Link>
        <Link href="/accessibility" className="text-[11px] text-silver/40 hover:text-silver/70 transition-colors">
          Accesibilidad
        </Link>
      </div>
    </div>
  );
}
