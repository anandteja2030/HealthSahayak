import { describe, expect, it, vi } from "vitest";
import { assessText, runSafetyGate, highestLevel, type GuidanceProvider, type SafetyRule } from "./index";

/**
 * Synthetic, non-medical test rules. Phase 1 ships an empty production
 * registry; these exist purely to prove the gate's ordering guarantees.
 */
const TEST_RULES: readonly SafetyRule[] = [
  {
    id: "test-emergency-input",
    level: "emergency",
    patterns: [/red-flag-input/],
    scope: "input",
    description: "Synthetic input emergency flag for tests",
  },
  {
    id: "test-emergency-output",
    level: "emergency",
    patterns: [/red-flag-output/],
    scope: "output",
    description: "Synthetic output emergency flag for tests",
  },
  {
    id: "test-urgent-both",
    level: "urgent",
    patterns: [/amber-flag/],
    scope: "both",
    description: "Synthetic urgent flag for tests",
  },
];

const request = (question: string) => ({ question, locale: "en" });

function providerReturning(
  answer: { text: string; suggestedLevel?: "low" | "moderate" | "urgent" | "emergency" } | null,
) {
  return {
    id: "test-provider",
    ask: vi.fn(async () => answer),
  } satisfies GuidanceProvider;
}

describe("highestLevel", () => {
  it("escalates only — never downgrades", () => {
    expect(highestLevel("low", "urgent")).toBe("urgent");
    expect(highestLevel("emergency", "low")).toBe("emergency");
    expect(highestLevel("moderate", "moderate")).toBe("moderate");
    expect(highestLevel()).toBe("low");
  });
});

describe("assessText", () => {
  it("returns low when the registry is empty (Phase 1 default)", () => {
    expect(assessText("anything at all", [], "input")).toEqual({
      level: "low",
      matchedRuleIds: [],
      source: "input",
    });
  });

  it("respects rule scope per pipeline side", () => {
    expect(assessText("red-flag-output", TEST_RULES, "input").level).toBe("low");
    expect(assessText("red-flag-input", TEST_RULES, "output").level).toBe("low");
    expect(assessText("an amber-flag note", TEST_RULES, "output").level).toBe("urgent");
  });

  it("returns the highest matching level", () => {
    const result = assessText("red-flag-input amber-flag", TEST_RULES, "input");
    expect(result.level).toBe("emergency");
    expect(result.matchedRuleIds).toEqual([
      "test-emergency-input",
      "test-urgent-both",
    ]);
  });
});

describe("runSafetyGate", () => {
  it("short-circuits emergency input BEFORE the provider is ever called", async () => {
    const provider = providerReturning({ text: "should never be used" });

    const result = await runSafetyGate(
      request("red-flag-input help"),
      provider,
      { rules: TEST_RULES },
    );

    expect(provider.ask).not.toHaveBeenCalled();
    expect(result.providerCalled).toBe(false);
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("emergency-input");
    expect(result.answer).toBeNull();
    expect(result.level).toBe("emergency");
  });

  it("discards provider output that is emergency-level on re-scan", async () => {
    const provider = providerReturning({ text: "contains red-flag-output inside" });

    const result = await runSafetyGate(
      request("ordinary question"),
      provider,
      { rules: TEST_RULES },
    );

    expect(provider.ask).toHaveBeenCalledTimes(1);
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("emergency-output");
    expect(result.answer).toBeNull();
    expect(result.output?.level).toBe("emergency");
    expect(result.level).toBe("emergency");
  });

  it("discards an answer even when only the provider CLAIMS emergency", async () => {
    const provider = providerReturning({ text: "looks harmless", suggestedLevel: "emergency" });

    const result = await runSafetyGate(
      request("ordinary question"),
      provider,
      { rules: TEST_RULES },
    );

    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("emergency-output");
    expect(result.answer).toBeNull();
    expect(result.level).toBe("emergency");
  });

  it("passes an answer through while preserving escalation to urgent", async () => {
    const provider = providerReturning({ text: "amber-flag noted", suggestedLevel: "moderate" });

    const result = await runSafetyGate(
      request("ordinary question"),
      provider,
      { rules: TEST_RULES },
    );

    expect(result.blocked).toBe(false);
    expect(result.reason).toBe("ok");
    expect(result.answer?.text).toBe("amber-flag noted");
    expect(result.level).toBe("urgent");
  });

  it("surfaces the Phase 1 provider's null answer as no-answer", async () => {
    const provider = providerReturning(null);

    const result = await runSafetyGate(request("question"), provider, {
      rules: TEST_RULES,
    });

    expect(result.reason).toBe("no-answer");
    expect(result.answer).toBeNull();
    expect(result.blocked).toBe(false);
    expect(result.providerCalled).toBe(true);
  });

  it("runs against the empty default registry when no rules are passed", async () => {
    const provider = providerReturning(null);

    const result = await runSafetyGate(request("anything"), provider);

    expect(result.input.level).toBe("low");
    expect(result.reason).toBe("no-answer");
  });
});
