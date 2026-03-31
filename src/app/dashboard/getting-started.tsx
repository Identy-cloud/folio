"use client";

import { useEffect, useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

const STORAGE_KEY = "folio-getting-started";

interface ChecklistState {
  dismissed: boolean;
  created: boolean;
  addedSlide: boolean;
  shared: boolean;
  triedAI: boolean;
}

const defaultState: ChecklistState = {
  dismissed: false,
  created: false,
  addedSlide: false,
  shared: false,
  triedAI: false,
};

function loadState(): ChecklistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function saveState(state: ChecklistState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface GettingStartedProps {
  presentationCount: number;
}

export function GettingStarted({ presentationCount }: GettingStartedProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<ChecklistState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (presentationCount >= 1) s.created = true;
    if (presentationCount >= 2) s.addedSlide = true;
    saveState(s);
    setState(s);
    setMounted(true);
  }, [presentationCount]);

  if (!mounted || state.dismissed || presentationCount >= 3) return null;

  const items = [
    { key: "created" as const, label: t.dashboard.checklistCreate, done: state.created },
    { key: "addedSlide" as const, label: t.dashboard.checklistSlide, done: state.addedSlide },
    { key: "shared" as const, label: t.dashboard.checklistShare, done: state.shared },
    { key: "triedAI" as const, label: t.dashboard.checklistAI, done: state.triedAI },
  ];

  const completed = items.filter((i) => i.done).length;

  function dismiss() {
    const next = { ...state, dismissed: true };
    saveState(next);
    setState(next);
  }

  return (
    <div className="mb-4 rounded border border-silver/30 bg-[#FAFAFA] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tracking-wide text-navy">
            {t.dashboard.gettingStartedTitle}
          </span>
          <span className="text-[10px] text-steel">
            {completed}/{items.length}
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label={t.dashboard.gettingStartedDismiss}
          className="p-1 text-steel transition-colors hover:text-navy"
        >
          <X size={14} />
        </button>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-navy/5">
        <div
          className="h-full rounded-full bg-navy/30 transition-all"
          style={{ width: `${(completed / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                item.done
                  ? "border-green-600 bg-green-600/20 text-green-600"
                  : "border-silver/40 text-transparent"
              }`}
            >
              {item.done && <Check size={10} weight="bold" />}
            </span>
            <span className={`text-xs ${item.done ? "text-steel line-through" : "text-navy"}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
