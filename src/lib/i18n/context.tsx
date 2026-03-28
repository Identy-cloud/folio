"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getDictionary, getLocaleFromCookie, setLocaleCookie, type Locale, type Dictionary } from "./index";

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocaleFromCookie);
  const t = getDictionary(locale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleCookie(next);
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
