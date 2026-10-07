import { useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useEmergency } from "./EmergencyContext";

/**
 * Emergency alert dialog. Content is deliberately non-diagnostic: it only
 * tells the user to reach real emergency services instead of waiting on
 * any in-app answer.
 */
export function EmergencyDialog() {
  const { t } = useLanguage();
  const { isOpen, closeEmergency } = useEmergency();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeEmergency();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeEmergency]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={closeEmergency}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="emergency-dialog-title"
        aria-describedby="emergency-dialog-body"
        className="glass-strong hs-rise w-full max-w-lg rounded-3xl border-rose-400/30 p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-400/40 bg-rose-500/15 text-rose-300">
              <Phone aria-hidden className="h-5 w-5" />
            </span>
            <h2
              id="emergency-dialog-title"
              className="text-xl font-semibold text-rose-100"
            >
              {t("emergency.title")}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeEmergency}
            aria-label={t("emergency.close")}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <p id="emergency-dialog-body" className="mt-4 text-sm leading-relaxed text-slate-300">
          {t("emergency.body")}
        </p>

        <ol className="mt-5 space-y-3">
          {[
            t("emergency.step1"),
            t("emergency.step2"),
            t("emergency.step3"),
          ].map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-500/10 font-mono text-[0.7rem] text-teal-300">
                {index + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:112"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-400/50 bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
          >
            <Phone aria-hidden className="h-4 w-4" />
            {t("emergency.call")}
          </a>
          <button
            type="button"
            onClick={closeEmergency}
            className="rounded-2xl border border-white/12 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          >
            {t("emergency.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
