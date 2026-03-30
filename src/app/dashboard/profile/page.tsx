"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { PortfolioLinkSection } from "./PortfolioLinkSection";
import { PlanUsageSection } from "./PlanUsageSection";
import { PreferencesSection } from "./PreferencesSection";
import { ConnectedAccountsSection } from "./ConnectedAccountsSection";
import { SecuritySection } from "./SecuritySection";
import { SessionsSection } from "./SessionsSection";
import { DataPrivacySection } from "./DataPrivacySection";
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
  socialLinks: { twitter?: string; linkedin?: string; github?: string; website?: string };
  emailDigest: boolean;
  createdAt: string;
  presentationCount: number;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const patch = useCallback((data: Record<string, unknown>) => {
    setProfile((p) => (p ? { ...p, ...data } : p));
  }, []);

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
      <SocialLinksSection socialLinks={profile.socialLinks ?? {}} onUpdate={patch} />
      {profile.username && <PortfolioLinkSection username={profile.username} />}

      <PlanUsageSection plan={profile.plan} storageUsed={profile.storageUsed ?? 0} />

      <div className="border border-neutral-800 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">{t.dashboard.profileMember ?? "Miembro desde"}</p>
        <p className="mt-1 text-sm text-neutral-300">{new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      <PreferencesSection emailDigest={profile.emailDigest} onToggleDigest={(next) => patch({ emailDigest: next })} />
      <ConnectedAccountsSection />

      <div className="space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Seguridad</p>
        <SecuritySection />
        <SessionsSection />
      </div>

      <DataPrivacySection />
      <DangerZone />
    </div>
  );
}
