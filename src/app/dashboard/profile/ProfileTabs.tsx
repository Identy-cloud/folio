"use client";

import { User, CreditCard, ShieldCheck, Database } from "@phosphor-icons/react";

const TABS = [
  { id: "profile", label: "Perfil", Icon: User },
  { id: "billing", label: "Plan", Icon: CreditCard },
  { id: "security", label: "Seguridad", Icon: ShieldCheck },
  { id: "data", label: "Datos", Icon: Database },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function ProfileTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-silver/30 pb-px scrollbar-none">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex shrink-0 items-center gap-1.5 px-3 py-2 text-xs font-medium tracking-wider transition-colors ${
            active === id
              ? "border-b-2 border-navy text-navy"
              : "text-steel hover:text-slate"
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
