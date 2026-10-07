import type { ReactNode } from "react";
import { Info, OctagonAlert, ShieldCheck, ShieldX } from "lucide-react";
import clsx from "clsx";
import { useEmergency } from "./emergency";

export type SafetyAlertVariant = "info" | "warning" | "emergency" | "blocked";

interface SafetyAlertProps {
  variant?: SafetyAlertVariant;
  title: string;
  children: ReactNode;
  /** Optional trailing action (e.g. a call or retry button). */
  action?: ReactNode;
  className?: string;
}

const VARIANTS: Record<
  SafetyAlertVariant,
  { icon: typeof Info; wrapper: string; iconWrap: string; iconClass: string; titleClass: string }
> = {
  info: {
    icon: ShieldCheck,
    wrapper: "border-teal-400/25 bg-teal-500/[0.07]",
    iconWrap: "border-teal-400/30 bg-teal-500/10 text-teal-300",
    iconClass: "h-4 w-4",
    titleClass: "text-teal-100",
  },
  warning: {
    icon: Info,
    wrapper: "border-amber-400/25 bg-amber-500/[0.06]",
    iconWrap: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    iconClass: "h-4 w-4",
    titleClass: "text-amber-100",
  },
  emergency: {
    icon: OctagonAlert,
    wrapper: "border-rose-400/40 bg-rose-500/[0.09]",
    iconWrap: "border-rose-400/40 bg-rose-500/15 text-rose-300",
    iconClass: "h-4 w-4",
    titleClass: "text-rose-100",
  },
  blocked: {
    icon: ShieldX,
    wrapper: "border-rose-400/35 bg-rose-500/[0.07]",
    iconWrap: "border-rose-400/35 bg-rose-500/12 text-rose-300",
    iconClass: "h-4 w-4",
    titleClass: "text-rose-100",
  },
};

/**
 * Standard safety notice. `emergency` variant also exposes a direct way to
 * open the emergency dialog so urgent guidance is never buried.
 */
export function SafetyAlert({
  variant = "info",
  title,
  children,
  action,
  className,
}: SafetyAlertProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;
  const { openEmergency } = useEmergency();

  return (
    <div
      role={variant === "emergency" ? "alert" : "note"}
      className={clsx(
        "flex flex-col gap-3 rounded-2xl border p-4 backdrop-blur-md sm:flex-row sm:items-start sm:gap-4",
        config.wrapper,
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          config.iconWrap,
        )}
      >
        <Icon className={config.iconClass} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={clsx("text-sm font-semibold", config.titleClass)}>{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-slate-300">{children}</div>
      </div>
      {action ?? (
        <button
          type="button"
          onClick={openEmergency}
          className={clsx(
            "shrink-0 self-start rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2",
            variant === "emergency" || variant === "blocked"
              ? "border-rose-400/50 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25 focus-visible:ring-rose-300/70"
              : "border-teal-400/35 bg-teal-500/10 text-teal-100 hover:bg-teal-500/20 focus-visible:ring-teal-300/70",
          )}
        >
          112
        </button>
      )}
    </div>
  );
}
