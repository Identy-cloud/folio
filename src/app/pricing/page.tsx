import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the right Folio plan for your needs. Free, Creator, Studio, and Agency plans available. Start creating editorial-style presentations today.",
  openGraph: {
    title: "Pricing | Folio",
    description: "Choose the right Folio plan. Free, Creator ($19/mo), Studio ($49/mo), and Agency ($149/mo) plans.",
    type: "website",
  },
};

export default function PricingPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Folio",
    description: "Editorial-style presentation platform",
    url: `${appUrl}/pricing`,
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "5 presentations, 100 MB storage",
      },
      {
        "@type": "Offer",
        name: "Creator",
        price: "19",
        priceCurrency: "USD",
        billingIncrement: "month",
        description: "Unlimited presentations, 10 GB storage, custom themes",
      },
      {
        "@type": "Offer",
        name: "Studio",
        price: "49",
        priceCurrency: "USD",
        billingIncrement: "month",
        description: "Everything in Creator plus collaboration and advanced features",
      },
      {
        "@type": "Offer",
        name: "Agency",
        price: "149",
        priceCurrency: "USD",
        billingIncrement: "month",
        description: "Everything in Studio plus workspace management and priority support",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingClient />
    </>
  );
}
