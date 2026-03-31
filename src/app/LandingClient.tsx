"use client";

import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { LandingFeatures } from "./LandingFeatures";
import { LandingStats } from "./LandingStats";
import { LandingTestimonials } from "./LandingTestimonials";
import { LandingTrustedBy } from "./LandingTrustedBy";
import { LandingComparison } from "./LandingComparison";
import { LandingHero } from "./LandingHero";
import { LandingCta } from "./LandingCta";

export function LandingClient() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-navy">
      <PublicHeader />

      <main id="main-content" className="flex flex-1 flex-col">
        <LandingHero />
        <LandingTrustedBy />
        <LandingFeatures />
        <LandingStats />
        <LandingComparison />
        <LandingTestimonials />
        <LandingCta />
      </main>

      <PublicFooter />
    </div>
  );
}
