"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "folio-onboarding-done";

const STEPS = [
  { target: "[data-slide-canvas]", title: "Canvas", text: "Haz click en cualquier elemento para seleccionarlo" },
  { target: "[data-slide-canvas]", title: "Mover y redimensionar", text: "Arrastra para mover, usa los handles para redimensionar" },
  { target: "[data-panel='slides']", title: "Panel de slides", text: "Gestiona y reordena tus slides aquí" },
  { target: "[data-panel='palette']", title: "Insertar elementos", text: "Añade textos, imágenes y formas" },
  { target: "[data-panel='toolbar']", title: "Toolbar", text: "Tu trabajo se guarda automáticamente. Cmd+Z para deshacer" },
];

export function Onboarding() {
  const [step, setStep] = useState(-1);

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
        aria-label="Tour del editor"
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={skip}
            className="text-xs text-neutral-500 hover:text-neutral-300"
            aria-label="Saltar tour"
          >
            Saltar tour
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
          {step >= STEPS.length - 1 ? "Empezar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
