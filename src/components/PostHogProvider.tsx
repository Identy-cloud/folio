"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, posthog, hasAnalyticsConsent } from "@/lib/posthog";

export function PostHogProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initPostHog();
    }
  }, []);

  useEffect(() => {
    if (posthog.__loaded && hasAnalyticsConsent()) {
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname]);

  useEffect(() => {
    function onConsent() {
      initPostHog();
    }
    window.addEventListener("folio-cookies-consent", onConsent);
    return () => window.removeEventListener("folio-cookies-consent", onConsent);
  }, []);

  return null;
}
