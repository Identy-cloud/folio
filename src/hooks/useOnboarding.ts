"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";

const STORAGE_KEY = "folio-onboarding-complete";

type Position = "top" | "bottom" | "left" | "right";

interface OnboardingStep {
  target: string;
  title: string;
  description: string;
  position: Position;
  desktopOnly?: boolean;
}

const STEPS: OnboardingStep[] = [
  {
    target: "[data-slide-canvas]",
    title: "Welcome to Folio",
    description: "This is your canvas. Click any element to select it, double-click to add text, or drag to draw shapes.",
    position: "bottom",
  },
  {
    target: "[data-panel='palette']",
    title: "Add elements",
    description: "Insert text, images, shapes and more from the element palette. Drag them onto the canvas to get started.",
    position: "left",
    desktopOnly: true,
  },
  {
    target: "[data-panel='palette']",
    title: "Edit properties",
    description: "Select any element, then adjust colors, fonts, opacity and other properties in this panel.",
    position: "left",
    desktopOnly: true,
  },
  {
    target: "[data-panel='slides']",
    title: "Manage slides",
    description: "Add, reorder and duplicate slides here. Use Ctrl+Enter for a new slide, Ctrl+Up/Down to reorder.",
    position: "right",
    desktopOnly: true,
  },
  {
    target: "[data-onboarding='share']",
    title: "Collaborate",
    description: "Share your presentation with a public link, invite collaborators for real-time editing, or export your work.",
    position: "bottom",
  },
  {
    target: "[data-onboarding='help']",
    title: "Keyboard shortcuts",
    description: "Press ? anytime to see all shortcuts, or use / to open the command palette for quick actions.",
    position: "top",
  },
];

interface OnboardingState {
  currentStep: number;
  currentStepData: OnboardingStep | null;
  totalSteps: number;
  isActive: boolean;
  next: () => void;
  previous: () => void;
  skip: () => void;
  complete: () => void;
  restart: () => void;
}

export function useOnboarding(): OnboardingState {
  const [step, setStep] = useState(-1);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const filteredSteps = isMobile
    ? STEPS.filter((s) => !s.desktopOnly)
    : STEPS;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;
    const timer = setTimeout(() => setStep(0), 800);
    return () => clearTimeout(timer);
  }, []);

  const markComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setStep(-1);
  }, []);

  const next = useCallback(() => {
    setStep((prev) => {
      if (prev >= filteredSteps.length - 1) {
        localStorage.setItem(STORAGE_KEY, "true");
        return -1;
      }
      return prev + 1;
    });
  }, [filteredSteps.length]);

  const previous = useCallback(() => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
  }, []);

  useEffect(() => {
    function handleRestart() {
      localStorage.removeItem(STORAGE_KEY);
      setStep(0);
    }
    window.addEventListener("folio:restart-onboarding", handleRestart);
    return () => window.removeEventListener("folio:restart-onboarding", handleRestart);
  }, []);

  const isActive = step >= 0 && step < filteredSteps.length;

  return {
    currentStep: step,
    currentStepData: isActive ? filteredSteps[step] : null,
    totalSteps: filteredSteps.length,
    isActive,
    next,
    previous,
    skip: markComplete,
    complete: markComplete,
    restart,
  };
}
