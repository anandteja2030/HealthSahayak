import { DEFAULT_RULES } from "./rules";
import {
  highestLevel,
  type GuidanceProvider,
  type GuidanceRequest,
  type ProviderAnswer,
  type SafetyAssessment,
  type SafetyGateResult,
  type SafetyRule,
  type TriageLevel,
} from "./types";

export interface SafetyGateOptions {
  /** Defaults to the shipped (Phase 1: empty) rule registry. */
  rules?: readonly SafetyRule[];
}

/** Scans text against the rule registry and returns the highest match. */
export function assessText(
  text: string,
  rules: readonly SafetyRule[],
  source: "input" | "output",
): SafetyAssessment {
  const haystack = text.toLowerCase();
  const matchedRuleIds: string[] = [];
  let level: TriageLevel = "low";

  for (const rule of rules) {
    if (source === "input" && rule.scope === "output") continue;
    if (source === "output" && rule.scope === "input") continue;
    const matched = rule.patterns.some((pattern) => pattern.test(haystack));
    if (matched) {
      matchedRuleIds.push(rule.id);
      level = highestLevel(level, rule.level);
    }
  }

  return { level, matchedRuleIds, source };
}

/**
 * The safety gate every question must pass through.
 *
 * Ordering is the guarantee — it is fixed here, not in the provider:
 *
 *  1. Input assessment ALWAYS runs first. Emergency input short-circuits:
 *     the provider is never invoked and no answer can be produced.
 *  2. The provider runs (if allowed) — it can only suggest urgency.
 *  3. Output is re-scanned AFTER the provider. Emergency-level output
 *     (detected or claimed by the model) is discarded and escalated.
 *
 * A future AI provider is plugged in only through this gate, so it can
 * escalate triage but can never bypass emergency handling.
 */
export async function runSafetyGate(
  request: GuidanceRequest,
  provider: GuidanceProvider,
  options: SafetyGateOptions = {},
): Promise<SafetyGateResult> {
  const rules = options.rules ?? DEFAULT_RULES;

  // 1. Pre-provider input scan — unconditional.
  const input = assessText(request.question, rules, "input");
  if (input.level === "emergency") {
    return {
      answer: null,
      input,
      output: null,
      level: "emergency",
      blocked: true,
      reason: "emergency-input",
      providerCalled: false,
    };
  }

  // 2. Provider call — only reachable when input is below emergency.
  const answer = await provider.ask(request);
  if (!answer) {
    return {
      answer: null,
      input,
      output: null,
      level: input.level,
      blocked: false,
      reason: "no-answer",
      providerCalled: true,
    };
  }

  // 3. Post-provider output scan — unconditional, and escalation-only.
  const output = assessText(answer.text, rules, "output");
  const suggested: TriageLevel = answer.suggestedLevel ?? "low";
  const level = highestLevel(input.level, output.level, suggested);

  if (level === "emergency") {
    return {
      answer: null,
      input,
      output,
      level,
      blocked: true,
      reason: "emergency-output",
      providerCalled: true,
    };
  }

  return {
    answer,
    input,
    output,
    level,
    blocked: false,
    reason: "ok",
    providerCalled: true,
  };
}

export type { ProviderAnswer };
