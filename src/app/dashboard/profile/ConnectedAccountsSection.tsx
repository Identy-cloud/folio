"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GoogleLogo, GithubLogo } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { Bone } from "./ProfileSkeleton";

interface Identity {
  provider: string;
  identityId: string;
  createdAt: string;
}

const PROVIDERS = [
  { id: "google", label: "Google", Icon: GoogleLogo },
  { id: "github", label: "GitHub", Icon: GithubLogo },
] as const;

export function ConnectedAccountsSection() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/identities")
      .then((r) => (r.ok ? r.json() : { identities: [] }))
      .then((data) => setIdentities(data.identities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLink(provider: string) {
    setBusy(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.linkIdentity({
        provider: provider as "google" | "github",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile` },
      });
      if (error) toast.error(error.message);
    } catch {
      toast.error("Connection error");
    }
    setBusy(null);
  }

  async function handleUnlink(identity: Identity) {
    if (identities.length <= 1) {
      toast.error("You need at least one connected account");
      return;
    }
    setBusy(identity.provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.unlinkIdentity({
        provider: identity.provider,
        identity_id: identity.identityId,
      } as Parameters<typeof supabase.auth.unlinkIdentity>[0]);
      if (error) {
        toast.error(error.message);
      } else {
        setIdentities((prev) => prev.filter((i) => i.identityId !== identity.identityId));
        toast.success(`${identity.provider} desconectado`);
      }
    } catch {
      toast.error("Connection error");
    }
    setBusy(null);
  }

  if (loading) return (
    <div className="space-y-4">
      <Bone className="h-3 w-36" />
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 border border-steel/30 p-4">
          <Bone className="h-5 w-5" />
          <div className="space-y-1 flex-1">
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
        Cuentas conectadas
      </p>
      {PROVIDERS.map(({ id, label, Icon }) => {
        const identity = identities.find((i) => i.provider === id);
        const isBusy = busy === id;
        return (
          <div key={id} className="flex items-center justify-between border border-steel/30 p-4">
            <div className="flex items-center gap-3">
              <Icon size={20} weight="bold" className="text-silver/70" />
              <div>
                <p className="text-xs text-silver">{label}</p>
                <p className="text-[11px] text-silver/50">
                  {identity ? `Conectado desde ${new Date(identity.createdAt).toLocaleDateString()}` : "No conectado"}
                </p>
              </div>
            </div>
            {identity ? (
              <button
                onClick={() => handleUnlink(identity)}
                disabled={isBusy || identities.length <= 1}
                className="text-xs text-silver/50 hover:text-red-400 transition-colors disabled:opacity-30"
              >
                {isBusy ? "..." : "Desconectar"}
              </button>
            ) : (
              <button
                onClick={() => handleLink(id)}
                disabled={isBusy}
                className="text-xs text-silver/70 hover:text-white transition-colors disabled:opacity-30"
              >
                {isBusy ? "..." : "Conectar"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
