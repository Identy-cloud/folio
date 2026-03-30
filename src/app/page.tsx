import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

export const metadata: Metadata = {
  title: "Folio — Editorial Slides for Agencies & Creatives",
  description: "Create stunning editorial-style presentations with beautiful typography, agency-grade aesthetics, real-time collaboration, and public sharing. Free to start.",
  keywords: ["presentations", "slides", "editorial design", "agency presentations", "collaboration", "portfolio", "templates"],
  openGraph: {
    title: "Folio — Editorial Slides for Agencies & Creatives",
    description: "Create stunning editorial-style presentations with beautiful typography, agency-grade aesthetics, and real-time collaboration.",
    type: "website",
  },
};

export default function LandingPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Folio",
    url: appUrl,
    description: "Editorial-style presentation platform for agencies and creatives.",
    sameAs: [],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free plan with 5 presentations",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingClient />
    </>
  );
}
