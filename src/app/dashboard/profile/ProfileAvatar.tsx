"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Camera } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

interface Props {
  profile: { name: string | null; email: string; avatarUrl: string | null };
  onUpdate: (patch: Record<string, unknown>) => void;
}

export function ProfileAvatar({ profile, onUpdate }: Props) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = (profile.name ?? profile.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleUpload(file: File) {
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
        onUpdate(data);
        toast.success(t.common.save);
      }
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setUploading(false);
    }
  }

  return (
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
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-600 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-50"
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
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      <div>
        <p className="text-sm text-neutral-200">{profile.name ?? profile.email}</p>
        <p className="text-xs text-neutral-500">{profile.email}</p>
      </div>
    </div>
  );
}
