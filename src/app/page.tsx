import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

export const metadata: Metadata = {
  title: "Folio — Presentations crafted to impress",
  description: "Create presentations that impress. Curated themes, precise typography, real-time collaboration, and responsive viewer. Free to start.",
  keywords: ["presentations", "slides", "professional design", "crafted presentations", "collaboration", "portfolio", "templates"],
  openGraph: {
    title: "Folio — Presentations crafted to impress",
    description: "Create presentations that impress. Curated themes, precise typography, and real-time collaboration.",
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
    description: "Modern presentation platform where design quality comes built-in.",
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
