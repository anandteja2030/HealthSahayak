import type { GuidanceProvider, GuidanceRequest, ProviderAnswer } from "../safety";

/**
 * Phase 1 provider stub.
 *
 * Phase 1 ships NO AI: this provider deliberately returns `null`, which the
 * safety gate surfaces as `reason: "no-answer"` and the Ask page renders as
 * a translated "guidance not connected" notice. No medical answer text is
 * ever produced here.
 *
 * Phase 2 replaces this (or adds a real provider behind the same
 * `GuidanceProvider` interface) — the safety gate and UI do not change.
 */
export const PHASE1_SIMULATED_LATENCY_MS = 400;

export const phase1Provider: GuidanceProvider = {
  id: "phase1-foundation",
  async ask(_request: GuidanceRequest): Promise<ProviderAnswer | null> {
    // Real async boundary so the loading state is exercised honestly.
    await new Promise((resolve) => setTimeout(resolve, PHASE1_SIMULATED_LATENCY_MS));
    return null;
  },
};
