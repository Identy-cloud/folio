"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  createdAt: string;
  presentationCount: number;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.name ?? "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveName() {
    if (!name.trim() || name === profile?.name) return;
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile((p) => (p ? { ...p, ...data } : p));
      toast.success(t.common.save);
    } else {
      toast.error(t.common.error);
    }
    setSaving(false);
  }

  async function handleAvatarUpload(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, filename: file.name }),
      });
      if (!res.ok) { toast.error(t.editor.uploadError); return; }

      const { signedUrl, publicUrl } = await res.json();
      const putRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) { toast.error(t.editor.uploadFileError); return; }

      const patchRes = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });
      if (patchRes.ok) {
        const data = await patchRes.json();
        setProfile((p) => (p ? { ...p, ...data } : p));
        toast.success(t.common.save);
      }
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-neutral-500">{t.common.loading}</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-red-400">{t.common.error}</span>
      </div>
    );
  }

  const initials = (profile.name ?? profile.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const planLabels: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    team: "Team",
  };

  return (
    <div className="mx-auto max-w-lg space-y-8 py-4 sm:py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </Link>
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
          {t.dashboard.profile ?? "PERFIL"}
        </h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={72}
              height={72}
              className="rounded-full object-cover"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-neutral-700 text-lg font-medium text-neutral-300">
              {initials}
            </div>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Change avatar"
          >
            <Camera size={14} />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
              e.target.value = "";
            }}
          />
        </div>
        <div>
          <p className="text-sm text-neutral-200">{profile.name ?? profile.email}</p>
          <p className="text-xs text-neutral-500">{profile.email}</p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          {t.dashboard.profileName ?? "Nombre"}
        </label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={profile.email}
            className="flex-1 border-b border-neutral-700 bg-transparent px-2 py-2 text-sm text-neutral-200 outline-none focus:border-white transition-colors"
          />
          <button
            onClick={handleSaveName}
            disabled={saving || !name.trim() || name === profile.name}
            className="shrink-0 bg-white px-4 py-2 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors disabled:opacity-30"
          >
            {saving ? "..." : t.common.save}
          </button>
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Email
        </label>
        <p className="border-b border-neutral-800 px-2 py-2 text-sm text-neutral-400">
          {profile.email}
        </p>
      </div>

      {/* Plan */}
      <div className="flex items-center justify-between border border-neutral-800 p-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {t.dashboard.profilePlan ?? "Plan"}
          </p>
          <p className="mt-1 text-lg font-medium text-neutral-200">
            {planLabels[profile.plan] ?? profile.plan}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile.plan !== "free" && (
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/portal", { method: "POST" });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              className="text-xs tracking-[0.2em] text-neutral-500 uppercase hover:text-white transition-colors"
            >
              Manage
            </button>
          )}
          <Link
            href="/pricing"
            className="text-xs tracking-[0.2em] text-neutral-400 uppercase hover:text-white transition-colors"
          >
            {t.dashboard.profileUpgrade ?? "Ver planes"}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-neutral-800 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {t.dashboard.profilePresentations ?? "Presentaciones"}
          </p>
          <p className="mt-1 font-display text-2xl tracking-tight">
            {profile.presentationCount}
          </p>
        </div>
        <div className="border border-neutral-800 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {t.dashboard.profileMember ?? "Miembro desde"}
          </p>
          <p className="mt-1 text-sm text-neutral-300">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
