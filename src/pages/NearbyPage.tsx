import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "../i18n";
import { SafetyAlert } from "../components/SafetyAlert";

/**
 * Nearby healthcare (Phase 1): honest empty state. No fake hospitals,
 * clinics, doctors, or pharmacies are ever rendered.
 */
export function NearbyPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      <div className="hs-rise">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
          {t("common.phaseBadge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          {t("nearby.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
          {t("nearby.subtitle")}
        </p>
      </div>

      <div className="mt-5">
        <SafetyAlert variant="info" title={t("safety.nonDiagnosticTitle")}>
          {t("safety.nonDiagnosticBody")}
        </SafetyAlert>
      </div>

      {/* Empty state — an intentionally empty collection, not fabricated data */}
      <section className="glass mt-6 rounded-3xl p-8 text-center sm:p-12">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/25 bg-teal-500/[0.07]">
          <MapPin aria-hidden className="h-6 w-6 text-teal-300/90" />
        </span>

        <div className="mx-auto mt-6 grid max-w-md gap-3" aria-hidden>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-white/[0.08] px-4 py-3"
            >
              <span className="h-8 w-8 shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.02]" />
              <span className="hs-skeleton h-2.5 flex-1 rounded-full" />
              <span className="chip !text-[0.6rem]">empty</span>
            </div>
          ))}
        </div>

        <h2 className="mt-7 text-xl font-semibold text-slate-100">
          {t("nearby.emptyTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          {t("nearby.emptyBody")}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 font-mono text-[0.68rem] text-slate-600">
          <Navigation aria-hidden className="h-3.5 w-3.5" />
          {t("nearby.emptyNote")}
        </p>

        <div className="mt-7">
          <Link
            to="/ask"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-teal-300/45 bg-teal-500/15 px-6 py-3.5 text-sm font-semibold text-teal-50 transition hover:bg-teal-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          >
            {t("nearby.browseButton")}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
