"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";

const STORAGE_KEY = "folio-onboarding-done";

export function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(-1);

  const STEPS = [
    { target: "[data-slide-canvas]", title: t.onboarding.step1Title, text: t.onboarding.step1Text },
    { target: "[data-slide-canvas]", title: t.onboarding.step2Title, text: t.onboarding.step2Text + " Double-click the canvas to add text. Drag to draw shapes." },
    { target: "[data-panel='slides']", title: t.onboarding.step3Title, text: t.onboarding.step3Text + " Use Ctrl+Up/Down to reorder slides." },
    { target: "[data-panel='palette']", title: t.onboarding.step4Title, text: t.onboarding.step4Text + " Toggle layers and history with the toolbar icons." },
    { target: "[data-panel='toolbar']", title: t.onboarding.step5Title, text: t.onboarding.step5Text + " Press ? anytime to see all shortcuts." },
  ];

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") return;
    const timer = setTimeout(() => setStep(0), 800);
    return () => clearTimeout(timer);
  }, []);

  if (step < 0 || step >= STEPS.length) return null;

  const current = STEPS[step];

  function next() {
    if (step >= STEPS.length - 1) {
      localStorage.setItem(STORAGE_KEY, "true");
      setStep(-1);
    } else {
      setStep(step + 1);
    }
  }

  function skip() {
    localStorage.setItem(STORAGE_KEY, "true");
    setStep(-1);
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={skip} />
      <div
        className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#1e1e1e] border border-neutral-700 p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t.onboarding.tourLabel}
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={skip}
            className="text-xs text-neutral-500 hover:text-neutral-300"
            aria-label={t.onboarding.skip}
          >
            {t.onboarding.skip}
          </button>
        </div>
        <h3 className="font-display text-lg tracking-tight text-neutral-200 sm:text-xl">
          {current.title.toUpperCase()}
        </h3>
        <p className="mt-1 text-sm text-neutral-400 leading-relaxed">
          {current.text}
        </p>
        <button
          onClick={next}
          className="mt-4 w-full bg-white py-2.5 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200"
        >
          {step >= STEPS.length - 1 ? t.onboarding.start : t.onboarding.next}
        </button>
      </div>
    </div>
  );
}
