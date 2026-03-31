"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TwitterLogo, LinkedinLogo, GithubLogo, Globe } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface Props {
  socialLinks: SocialLinks;
  onUpdate: (patch: Record<string, unknown>) => void;
}

const FIELDS = [
  { key: "twitter" as const, label: "Twitter / X", Icon: TwitterLogo, placeholder: "https://x.com/username" },
  { key: "linkedin" as const, label: "LinkedIn", Icon: LinkedinLogo, placeholder: "https://linkedin.com/in/username" },
  { key: "github" as const, label: "GitHub", Icon: GithubLogo, placeholder: "https://github.com/username" },
  { key: "website" as const, label: "Website", Icon: Globe, placeholder: "https://yoursite.com" },
];

export function SocialLinksSection({ socialLinks, onUpdate }: Props) {
  const { t } = useTranslation();
  const [links, setLinks] = useState<SocialLinks>(socialLinks);
  const [saving, setSaving] = useState(false);

  const hasChanges = FIELDS.some((f) => (links[f.key] ?? "") !== (socialLinks[f.key] ?? ""));

  async function handleSave() {
    setSaving(true);
    const cleaned: SocialLinks = {};
    for (const f of FIELDS) {
      const val = links[f.key]?.trim();
      if (val) cleaned[f.key] = val;
    }
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socialLinks: cleaned }),
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

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-steel">
        Redes sociales
      </p>
      {FIELDS.map(({ key, label, Icon, placeholder }) => (
        <div key={key} className="flex items-center gap-2">
          <Icon size={16} className="shrink-0 text-steel" />
          <input
            value={links[key] ?? ""}
            onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
            aria-label={label}
            className="flex-1 border-b border-silver/40 bg-transparent px-2 py-1.5 text-sm text-navy outline-none placeholder:text-steel/50 focus:border-navy transition-colors"
          />
        </div>
      ))}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="shrink-0 bg-accent px-4 py-2 text-xs font-medium tracking-widest text-white uppercase hover:bg-accent-hover transition-colors disabled:opacity-30"
        >
          {saving ? "..." : t.common.save}
        </button>
      </div>
    </div>
  );
}
