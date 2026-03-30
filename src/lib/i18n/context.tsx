"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getDictionary, getLocaleFromCookie, setLocaleCookie, type Locale, type Dictionary } from "./index";

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getPersistedLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem("folio-locale") as Locale | null;
  if (stored && ["es", "en", "fr", "de", "it", "pt"].includes(stored)) return stored;
  return getLocaleFromCookie();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getPersistedLocale);
  const t = getDictionary(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleCookie(next);
    localStorage.setItem("folio-locale", next);
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
