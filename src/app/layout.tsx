import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Folio — Editorial Slides",
  description: "Presentaciones con estética editorial de agencia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
