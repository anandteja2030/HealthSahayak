import { Siren } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../../i18n";
import { useEmergency } from "./EmergencyContext";

interface EmergencyButtonProps {
  /** Hide the text label on narrow viewports. */
  compact?: boolean;
  className?: string;
}

export function EmergencyButton({ compact = false, className }: EmergencyButtonProps) {
  const { t } = useLanguage();
  const { openEmergency } = useEmergency();

  return (
    <button
      type="button"
      onClick={openEmergency}
      aria-label={t("nav.emergency")}
      title={t("nav.emergency")}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border border-rose-400/45 bg-rose-500/10 px-3.5 py-2 text-sm font-semibold text-rose-200",
        "transition hover:border-rose-300/70 hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70",
        compact && "px-2.5",
        className,
      )}
    >
      <Siren aria-hidden className="h-4 w-4" />
      {!compact && <span>{t("nav.emergency")}</span>}
    </button>
  );
}
