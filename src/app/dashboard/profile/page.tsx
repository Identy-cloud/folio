"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, DownloadSimple, Copy, Check } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { PlanUsageSection } from "./PlanUsageSection";
import { PreferencesSection } from "./PreferencesSection";
import { SecuritySection } from "./SecuritySection";
import { DangerZone } from "./DangerZone";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  plan: string;
  storageUsed: number;
  emailDigest: boolean;
  createdAt: string;
  presentationCount: number;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const patch = useCallback((data: Record<string, unknown>) => {
    setProfile((p) => (p ? { ...p, ...data } : p));
  }, []);

  const handleExportData = useCallback(async () => {
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
    } catch { toast.error(t.common.connectionError); }
    finally { setExporting(false); }
  }, [t]);

  function copyPortfolioUrl() {
    navigator.clipboard.writeText(`${window.location.origin}/u/${profile?.username}`);
    setCopiedUrl(true);
    toast.success("URL copiada");
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  if (loading) return <div className="flex items-center justify-center py-32"><span className="text-sm text-neutral-500">{t.common.loading}</span></div>;
  if (!profile) return <div className="flex items-center justify-center py-32"><span className="text-sm text-red-400">{t.common.error}</span></div>;

  return (
    <div className="mx-auto max-w-lg space-y-8 py-4 sm:py-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors" aria-label="Back">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{t.dashboard.profile ?? "PERFIL"}</h2>
      </div>

      <ProfileAvatar profile={profile} onUpdate={patch} />
      <PersonalInfoSection profile={profile} onUpdate={patch} />

      {/* Portfolio link */}
      {profile.username && (
        <div className="border border-neutral-800 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Portfolio publico</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="flex-1 truncate text-sm text-neutral-300">
              {typeof window !== "undefined" ? window.location.origin : ""}/u/{profile.username}
            </p>
            <button onClick={copyPortfolioUrl} aria-label="Copy URL" className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
              {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <Link href={`/u/${profile.username}`} target="_blank" className="text-xs tracking-[0.15em] text-neutral-500 uppercase hover:text-white transition-colors">
              Ver
            </Link>
          </div>
        </div>
      )}

      <PlanUsageSection plan={profile.plan} storageUsed={profile.storageUsed ?? 0} />

      {/* Member since */}
      <div className="border border-neutral-800 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">{t.dashboard.profileMember ?? "Miembro desde"}</p>
        <p className="mt-1 text-sm text-neutral-300">{new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      <PreferencesSection emailDigest={profile.emailDigest} onToggleDigest={(next) => patch({ emailDigest: next })} />

      <div className="space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Seguridad</p>
        <SecuritySection />
      </div>

      {/* Data & Privacy */}
      <div className="space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Datos y privacidad</p>
        <div className="border border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-200">{t.dashboard.exportData ?? "Exportar mis datos"}</p>
              <p className="mt-0.5 text-[11px] text-neutral-500">{t.dashboard.exportDataDesc ?? "Descarga todos tus datos en JSON (GDPR)"}</p>
            </div>
            <button onClick={handleExportData} disabled={exporting} className="flex shrink-0 items-center gap-2 border border-neutral-700 px-3 py-1.5 text-xs font-medium tracking-widest text-neutral-300 uppercase hover:border-white hover:text-white transition-colors disabled:opacity-30">
              <DownloadSimple size={14} />
              {exporting ? "..." : (t.dashboard.exportAction ?? "Exportar")}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
          <Link href="/terms" className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors">Terminos de servicio</Link>
          <Link href="/privacy" className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors">Politica de privacidad</Link>
          <Link href="/cookies" className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors">Cookies</Link>
          <Link href="/dmca" className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors">DMCA</Link>
          <Link href="/accessibility" className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors">Accesibilidad</Link>
        </div>
      </div>

      <DangerZone />
    </div>
  );
}
