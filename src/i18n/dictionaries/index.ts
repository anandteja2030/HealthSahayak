import type { Locale } from "../locales";
import type { TranslationKey } from "./en";
import { en } from "./en";
import { hi } from "./hi";
import { te } from "./te";

export type { TranslationKey };

export type Dictionary = Record<TranslationKey, string>;

/** All bundled dictionaries. Missing keys are a compile-time error. */
export const dictionaries: Record<Locale, Dictionary> = { en, te, hi };

export { en, te, hi };
