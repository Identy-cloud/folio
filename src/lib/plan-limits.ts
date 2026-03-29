import type { Plan } from "./stripe";

interface PlanLimits {
  maxPresentations: number;
  maxCollaborators: number;
  hasWatermark: boolean;
  canExportPdf: boolean;
  canExportPptx: boolean;
  canCollaborate: boolean;
  canUseCustomDomain: boolean;
  canUseBrandKit: boolean;
  canUseCustomFonts: boolean;
  canUseMultiWorkspace: boolean;
  canWhiteLabel: boolean;
  canUseAllTemplates: boolean;
  canUseAnalytics: boolean;
  canUseAdvancedAnalytics: boolean;
}

const LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxPresentations: 3,
    maxCollaborators: 0,
    hasWatermark: true,
    canExportPdf: false,
    canExportPptx: false,
    canCollaborate: false,
    canUseCustomDomain: false,
    canUseBrandKit: false,
    canUseCustomFonts: false,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: false,
    canUseAnalytics: false,
    canUseAdvancedAnalytics: false,
  },
  creator: {
    maxPresentations: Infinity,
    maxCollaborators: 0,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: false,
    canCollaborate: false,
    canUseCustomDomain: true,
    canUseBrandKit: false,
    canUseCustomFonts: false,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: false,
  },
  studio: {
    maxPresentations: Infinity,
    maxCollaborators: 5,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: true,
    canCollaborate: true,
    canUseCustomDomain: true,
    canUseBrandKit: true,
    canUseCustomFonts: true,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: false,
  },
  agency: {
    maxPresentations: Infinity,
    maxCollaborators: Infinity,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: true,
    canCollaborate: true,
    canUseCustomDomain: true,
    canUseBrandKit: true,
    canUseCustomFonts: true,
    canUseMultiWorkspace: true,
    canWhiteLabel: true,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return LIMITS[(plan as Plan)] ?? LIMITS.free;
}

export const PLAN_PRICES = {
  creator: { monthly: 19, annual: 15 },
  studio: { monthly: 49, annual: 39 },
  agency: { monthly: 149, annual: 119 },
} as const;

export function requiredPlanFor(feature: keyof PlanLimits): Plan {
  if (LIMITS.creator[feature]) return "creator";
  if (LIMITS.studio[feature]) return "studio";
  return "agency";
}
