import type { Metadata, Viewport } from "next";
import {
  Bebas_Neue,
  DM_Sans,
  Playfair_Display,
  DM_Mono,
  Cormorant_Garamond,
  Lato,
  Barlow_Condensed,
  Barlow,
} from "next/font/google";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/context";
import { CookieBanner } from "@/components/CookieBanner";
import { GlobalDialog } from "@/components/ui/GlobalDialog";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const fontVars = [
  bebasNeue.variable,
  dmSans.variable,
  playfairDisplay.variable,
  dmMono.variable,
  cormorantGaramond.variable,
  lato.variable,
  barlowCondensed.variable,
  barlow.variable,
].join(" ");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Folio — Presentations crafted to impress",
    template: "%s | Folio",
  },
  description: "Presentations crafted to impress. Curated themes, precise typography, real-time collaboration, and responsive viewer.",
  keywords: ["presentations", "slides", "design", "professional", "collaboration", "templates", "portfolio", "crafted"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Folio",
    title: "Folio — Presentations crafted to impress",
    description: "Presentations crafted to impress. Curated themes, precise typography, real-time collaboration.",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folio — Presentations crafted to impress",
    description: "Presentations crafted to impress. Curated themes, precise typography, real-time collaboration.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Folio",
  },
  other: {
    "theme-color": "#1E2A3A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontVars} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white">
            Saltar al contenido
          </a>
          {children}
          <GlobalDialog />
          <CookieBanner />
          <PostHogProvider />
          <ServiceWorkerRegistrar />
        </I18nProvider>
        <Toaster
          position="bottom-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--color-slate)",
              border: "1px solid var(--color-steel)",
              color: "var(--color-silver)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
