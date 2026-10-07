import type { SafetyRule } from "./types";

/**
 * Phase 1 ships the RULE REGISTRY STRUCTURE only — it is intentionally empty.
 *
 * No medical rules, keywords, or clinical heuristics are invented here.
 * A later phase populates this list with clinician-reviewed, locale-specific
 * indicators (en/te/hi) after proper safety review. The gate logic in
 * `gate.ts` is already emergency-first and does not change when rules land.
 */
export const DEFAULT_RULES: readonly SafetyRule[] = [];
