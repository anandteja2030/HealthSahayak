/** Triage levels ordered from least to most severe. */
export type TriageLevel = "low" | "moderate" | "urgent" | "emergency";

export const TRIAGE_LEVELS = ["low", "moderate", "urgent", "emergency"] as const;

export const TRIAGE_RANK: Record<TriageLevel, number> = {
  low: 0,
  moderate: 1,
  urgent: 2,
  emergency: 3,
};

/** Returns the more severe of two triage levels. Escalation only — never downgrade. */
export function highestLevel(
  ...levels: TriageLevel[]
): TriageLevel {
  return levels.reduce<TriageLevel>(
    (worst, level) => (TRIAGE_RANK[level] > TRIAGE_RANK[worst] ? level : worst),
    "low",
  );
}

/**
 * A declarative triage rule. Rules are data, not code: the gate evaluates
 * them the same way regardless of which AI provider (if any) is plugged in.
 *
 * Phase 1 ships an empty registry — see `rules.ts`. No clinical logic is
 * invented in this phase.
 */
export interface SafetyRule {
  /** Stable identifier used in assessments and audit logs. */
  id: string;
  /** Level produced when any pattern matches. */
  level: Exclude<TriageLevel, "low">;
  /** Case-insensitive patterns evaluated against the scanned text. */
  patterns: readonly RegExp[];
  /** Which side of the pipeline the rule applies to. */
  scope: "input" | "output" | "both";
  /** Reviewer-facing description (never shown to end users). */
  description: string;
}

export interface SafetyAssessment {
  /** Highest level matched, or "low" when nothing matched. */
  level: TriageLevel;
  /** IDs of every rule that matched. */
  matchedRuleIds: string[];
  /** Which pipeline stage produced this assessment. */
  source: "input" | "output";
}

/** A question as handed to the safety gate. */
export interface GuidanceRequest {
  question: string;
  locale: string;
}

/** A provider's answer. Providers never assign the final triage level. */
export interface ProviderAnswer {
  text: string;
  /** Provider's own urgency opinion — can escalate, never bypass. */
  suggestedLevel?: TriageLevel;
}

/**
 * Future AI/RAG provider boundary. Phase 1 ships only a stub that returns
 * `null` ("nothing to show yet"). Gemini/RAG integrations implement this
 * interface and are wrapped by `runSafetyGate` — they never talk to the UI
 * directly, which is what makes emergency handling impossible to bypass.
 */
export interface GuidanceProvider {
  id: string;
  ask(request: GuidanceRequest): Promise<ProviderAnswer | null>;
}

export type SafetyGateReason =
  /** Answer passed both scans. */
  | "ok"
  /** Emergency indicators in the user input — provider was never called. */
  | "emergency-input"
  /** Emergency indicators in (or claimed by) the provider output — answer discarded. */
  | "emergency-output"
  /** Provider returned no answer (Phase 1 stub). */
  | "no-answer";

export interface SafetyGateResult {
  /** `null` when blocked or when the provider had nothing to return. */
  answer: ProviderAnswer | null;
  input: SafetyAssessment;
  output: SafetyAssessment | null;
  /** Final triage level (escalation only). */
  level: TriageLevel;
  blocked: boolean;
  reason: SafetyGateReason;
  /** Whether the AI provider was invoked at all. */
  providerCalled: boolean;
}
