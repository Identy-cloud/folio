"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { ProfileTabs, type TabId } from "./ProfileTabs";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { PortfolioLinkSection } from "./PortfolioLinkSection";
import { BillingSection } from "./BillingSection";
import { PlanFeaturesSection } from "./PlanFeaturesSection";
import { PlanUsageSection } from "./PlanUsageSection";
import { PreferencesSection } from "./PreferencesSection";
import { ConnectedAccountsSection } from "./ConnectedAccountsSection";
import { SecuritySection } from "./SecuritySection";
import { SessionsSection } from "./SessionsSection";
import { DataPrivacySection } from "./DataPrivacySection";
import { DangerZone } from "./DangerZone";
import { ProfileSkeleton } from "./ProfileSkeleton";

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
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "profile";
  const [tab, setTab] = useState<TabId>(initialTab);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const patch = useCallback((data: Record<string, unknown>) => {
    setProfile((p) => (p ? { ...p, ...data } : p));
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (!profile) return <div className="flex items-center justify-center py-32"><span className="text-sm text-red-500">{t.common.error}</span></div>;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded text-slate hover:bg-[#FAFAFA] hover:text-navy transition-colors" aria-label="Back">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="font-display text-2xl tracking-tight text-navy sm:text-3xl">{t.dashboard.profile ?? "PERFIL"}</h2>
      </div>

      <ProfileTabs active={tab} onChange={setTab} />

      <div className="mt-6 space-y-8">
        {tab === "profile" && (
          <>
            <ProfileAvatar profile={profile} onUpdate={patch} />
            <PersonalInfoSection profile={profile} onUpdate={patch} />
            <SocialLinksSection socialLinks={profile.socialLinks ?? {}} onUpdate={patch} />
            {profile.username && <PortfolioLinkSection username={profile.username} />}
            <PreferencesSection emailDigest={profile.emailDigest} onToggleDigest={(next) => patch({ emailDigest: next })} />
            <div className="border border-silver/30 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-steel">{t.dashboard.profileMember ?? "Miembro desde"}</p>
              <p className="mt-1 text-sm text-slate">{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </>
        )}
        {tab === "billing" && (
          <>
            <BillingSection />
            <PlanFeaturesSection plan={profile.plan} />
            <PlanUsageSection plan={profile.plan} storageUsed={profile.storageUsed ?? 0} />
          </>
        )}
        {tab === "security" && (
          <>
            <SecuritySection />
            <SessionsSection />
            <ConnectedAccountsSection />
          </>
        )}
        {tab === "data" && (
          <>
            <DataPrivacySection />
            <DangerZone />
          </>
        )}
      </div>
    </div>
  );
}
