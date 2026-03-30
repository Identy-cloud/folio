"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";

export function Onboarding() {
  const {
    currentStepData, currentStep, totalSteps,
    isActive, next, previous, skip,
  } = useOnboarding();

  if (!isActive || !currentStepData) return null;

  return (
    <OnboardingTooltip
      target={currentStepData.target}
      title={currentStepData.title}
      description={currentStepData.description}
      position={currentStepData.position}
      stepNumber={currentStep + 1}
      totalSteps={totalSteps}
      onNext={next}
      onPrevious={previous}
      onSkip={skip}
    />
  );
}
