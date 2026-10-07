import { query } from "./_generated/server";

/**
 * Phase 1 Convex foundation: a non-medical health-check query.
 *
 * No user data, no medical records, no seeded hospitals/doctors/clinics.
 * Later phases add real collections through the same validated boundary.
 */
export const ping = query({
  args: {},
  handler: async () => {
    return {
      status: "ok" as const,
      service: "HealthSahayak",
      phase: 1 as const,
      serverTime: Date.now(),
    };
  },
});
