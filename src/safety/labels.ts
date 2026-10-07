import type { TranslationKey } from "../i18n";
import type { TriageLevel } from "./types";

const TRIAGE_LABEL_KEYS: Record<TriageLevel, TranslationKey> = {
  low: "triage.low",
  moderate: "triage.moderate",
  urgent: "triage.urgent",
  emergency: "triage.emergency",
};

const TRIAGE_DESC_KEYS: Record<TriageLevel, TranslationKey> = {
  low: "triage.lowDesc",
  moderate: "triage.moderateDesc",
  urgent: "triage.urgentDesc",
  emergency: "triage.emergencyDesc",
};

export function triageLabelKey(level: TriageLevel): TranslationKey {
  return TRIAGE_LABEL_KEYS[level];
}

export function triageDescriptionKey(level: TriageLevel): TranslationKey {
  return TRIAGE_DESC_KEYS[level];
}
