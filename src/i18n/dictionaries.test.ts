import { describe, expect, it } from "vitest";
import { en, hi, te } from "./dictionaries";
import { LOCALES } from "./locales";

describe("translation dictionaries", () => {
  const dictionaries = { en, te, hi };

  it("implements exactly the English key set in every locale", () => {
    const enKeys = Object.keys(en).sort();
    for (const locale of LOCALES) {
      expect(Object.keys(dictionaries[locale]).sort(), `locale: ${locale}`).toEqual(enKeys);
    }
  });

  it("has no empty or placeholder-free values", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(dictionaries[locale])) {
        expect(typeof value, `${locale}.${key}`).toBe("string");
        expect(value.trim().length, `${locale}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps non-translatable brand terms consistent", () => {
    expect(te["app.name"]).toBe("HealthSahayak");
    expect(hi["app.name"]).toBe("HealthSahayak");
    expect(en["ask.assistant"]).toBe("HealthSahayak");
  });

  it("covers the required navigation labels", () => {
    const requiredKeys = [
      "nav.home",
      "nav.ask",
      "nav.nearby",
      "nav.help",
      "nav.privacy",
      "nav.emergency",
    ] as const;
    for (const key of requiredKeys) {
      expect(Object.keys(en)).toContain(key);
    }
  });
});
