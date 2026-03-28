import { es, type Dictionary } from "./es";
import { en } from "./en";
import { fr } from "./fr";
import { de } from "./de";
import { it } from "./it";
import { pt } from "./pt";

export type Locale = "es" | "en" | "fr" | "de" | "it" | "pt";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
];

const dictionaries: Record<Locale, Dictionary> = { es, en, fr, de, it, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? es;
}

export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(/(?:^|; )locale=(\w+)/);
  const val = match?.[1] as Locale | undefined;
  return val && val in dictionaries ? val : "es";
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export type { Dictionary };
