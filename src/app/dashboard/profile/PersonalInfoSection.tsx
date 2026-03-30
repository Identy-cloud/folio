"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  profile: { name: string | null; email: string; username: string | null; bio: string | null };
  onUpdate: (patch: Record<string, unknown>) => void;
}

export function PersonalInfoSection({ profile, onUpdate }: Props) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(profile.name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [usernameError, setUsernameError] = useState("");

  async function handleSaveName() {
    if (!name.trim() || name === profile.name) return;
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      onUpdate(data);
      toast.success(t.common.save);
    } else {
      toast.error(t.common.error);
    }
    setSaving(false);
  }

  async function handleSaveProfile() {
    setUsernameError("");
    const usernameVal = username.trim().toLowerCase() || null;
    if (usernameVal && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,28}[a-zA-Z0-9]$/.test(usernameVal)) {
      setUsernameError("3-30 chars, alphanumeric and hyphens only");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameVal, bio: bio.trim() || null }),
    });
    if (res.ok) {
      const data = await res.json();
      onUpdate(data);
      toast.success(t.common.save);
    } else {
      const err = await res.json().catch(() => ({ error: "Error" }));
      if (err.error === "Username already taken") setUsernameError("Username already taken");
      else toast.error(t.common.error);
    }
    setSaving(false);
  }

  return (
    <>
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

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Email
        </label>
        <p className="border-b border-neutral-800 px-2 py-2 text-sm text-neutral-400">
          {profile.email}
        </p>
      </div>

      {/* Username + Bio */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
            placeholder="your-username"
            className="w-full border-b border-neutral-700 bg-transparent px-2 py-2 text-sm text-neutral-200 outline-none focus:border-white transition-colors"
          />
          {usernameError && <p className="text-xs text-red-400">{usernameError}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio for your portfolio page"
            maxLength={300}
            rows={3}
            className="w-full resize-none border-b border-neutral-700 bg-transparent px-2 py-2 text-sm text-neutral-200 outline-none focus:border-white transition-colors"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-600">{bio.length}/300</p>
            <button
              onClick={handleSaveProfile}
              disabled={saving || (username === (profile.username ?? "") && bio === (profile.bio ?? ""))}
              className="shrink-0 bg-white px-4 py-2 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors disabled:opacity-30"
            >
              {saving ? "..." : t.common.save}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
