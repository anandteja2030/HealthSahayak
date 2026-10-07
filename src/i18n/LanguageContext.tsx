import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type TranslationKey } from "./dictionaries";
import { isLocale, LOCALE_META, LOCALES, type Locale } from "./locales";

const STORAGE_KEY = "healthsahayak.locale";

export type { Locale, TranslationKey };
export { LOCALES, LOCALE_META };

interface LanguageContextValue {
  locale: Locale;
  locales: readonly Locale[];
  setLocale: (locale: Locale) => void;
  /** Translate a key, interpolating `{name}` placeholders from `vars`. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** BCP-47 tag for speech recognition engines. */
  speechLang: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage may be unavailable (private mode); fall through to detection.
  }
  const navigatorLang = typeof navigator !== "undefined" ? navigator.language : "";
  if (navigatorLang.toLowerCase().startsWith("te")) return "te";
  if (navigatorLang.toLowerCase().startsWith("hi")) return "hi";
  return "en";
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Non-fatal: language just won't persist.
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const dictionary = dictionaries[locale] ?? dictionaries.en;
      return interpolate(dictionary[key] ?? dictionaries.en[key], vars);
    },
    [locale],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      locales: LOCALES,
      setLocale,
      t,
      speechLang: LOCALE_META[locale].speechLang,
    }),
    [locale, setLocale, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
