export const LOCALES = ["en", "te", "hi"] as const;

export type Locale = (typeof LOCALES)[number];

export interface LocaleMeta {
  /** BCP-47 tag used for speech recognition. */
  speechLang: string;
  /** Human label in the language's own script. */
  nativeLabel: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { speechLang: "en-IN", nativeLabel: "English" },
  te: { speechLang: "te-IN", nativeLabel: "తెలుగు" },
  hi: { speechLang: "hi-IN", nativeLabel: "हिन्दी" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
