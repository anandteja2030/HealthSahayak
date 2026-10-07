import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  FileText,
  Globe,
  HeartPulse,
  Languages,
  Lock,
  Mic,
  Server,
  Shield,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useLanguage } from "../i18n";
import { SafetyAlert } from "../components/SafetyAlert";
import { TRIAGE_LEVELS, triageDescriptionKey, triageLabelKey } from "../safety";

const WAVE_BARS = [0.5, 0.9, 0.35, 0.75, 1, 0.45, 0.8, 0.3, 0.65, 0.95, 0.4, 0.7, 0.55, 0.85];

function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function HeroConsole() {
  const { t } = useLanguage();

  const statusLines = [
    { key: "console.safety" as const, tone: "text-teal-300" },
    { key: "console.locales" as const, tone: "text-cyan-300" },
    { key: "console.voice" as const, tone: "text-teal-200" },
    { key: "console.provider" as const, tone: "text-amber-300" },
  ];

  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="chip">{t("common.phaseBadge")}</span>
        <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-teal-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-300 hs-blink" />
          online
        </span>
      </div>

      <div className="mt-5 flex h-16 items-end justify-between gap-1" aria-hidden>
        {WAVE_BARS.map((height, index) => (
          <span
            key={index}
            className="hs-wave-bar w-1.5 rounded-full bg-gradient-to-t from-teal-500/70 to-cyan-300/90"
            style={{
              height: `${Math.round(height * 100)}%`,
              animationDelay: `${index * 0.11}s`,
            }}
          />
        ))}
      </div>

      <ul className="mt-6 space-y-2.5 font-mono text-[0.74rem] leading-relaxed">
        {statusLines.map((line) => (
          <li key={line.key} className="flex items-start gap-2.5">
            <span className="text-slate-600">›</span>
            <span className={line.tone}>{t(line.key)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-white/[0.07] pt-4">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-slate-500">
          triage.levels
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRIAGE_LEVELS.map((level) => (
            <span
              key={level}
              className={`chip ${
                level === "emergency"
                  ? "!border-rose-400/40 !text-rose-300"
                  : level === "urgent"
                    ? "!border-amber-400/35 !text-amber-300"
                    : "!border-teal-400/30 !text-teal-300"
              }`}
            >
              {t(triageLabelKey(level))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Landing page: hero, how-it-works, voice/languages, safety architecture, trust, CTA. */
export function HomePage() {
  const { t } = useLanguage();

  const steps = [
    { titleKey: "home.step1Title", bodyKey: "home.step1Body" },
    { titleKey: "home.step2Title", bodyKey: "home.step2Body" },
    { titleKey: "home.step3Title", bodyKey: "home.step3Body" },
  ] as const;

  const trustCards = [
    { Icon: Shield, titleKey: "home.trust1Title", bodyKey: "home.trust1Body" },
    { Icon: HeartPulse, titleKey: "home.trust2Title", bodyKey: "home.trust2Body" },
    { Icon: Lock, titleKey: "home.trust3Title", bodyKey: "home.trust3Body" },
  ] as const;

  const gateFlow = ["INPUT", "pre-scan", "PROVIDER", "post-scan", "OUTPUT"];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-4 pt-14 sm:px-6 md:grid-cols-[1.15fr_1fr] md:items-center md:pt-20">
          <div className="hs-rise">
            <span className="chip inline-flex items-center gap-2">
              <Sparkles aria-hidden className="h-3 w-3 text-teal-300" />
              {t("home.eyebrow")}
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{t("home.headline")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {t("home.subhead")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ask?mode=voice"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-teal-300/50 bg-teal-500/15 px-6 py-4 text-sm font-semibold text-teal-50 shadow-[0_0_44px_-16px_rgba(45,212,191,0.7)] transition hover:bg-teal-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
              >
                <Mic aria-hidden className="h-4 w-4" />
                {t("home.ctaSpeak")}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/ask"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
              >
                <FileText aria-hidden className="h-4 w-4 text-teal-300" />
                {t("home.ctaType")}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-8">
              <SafetyAlert
                variant="info"
                title={t("safety.nonDiagnosticTitle")}
                className="backdrop-blur-sm"
              >
                {t("safety.nonDiagnosticBody")}
              </SafetyAlert>
            </div>
          </div>

          <div className="hs-rise">
            <HeroConsole />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- how it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow={t("home.eyebrowHow")} title={t("home.howTitle")} />
        <ol className="hs-stagger mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.titleKey}
              className="glass glass-hover relative overflow-hidden rounded-3xl p-6"
            >
              <span className="font-mono text-3xl font-semibold text-teal-400/25">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {t(step.bodyKey)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------- voice + languages */}
      <section className="border-y border-white/[0.05] bg-white/[0.015]">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="glass glass-hover rounded-3xl p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-500/10">
              <Mic aria-hidden className="h-5 w-5 text-teal-300" />
            </span>
            <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
              {t("home.eyebrowVoice")}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-50">
              {t("home.voiceTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {t("home.voiceBody")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[0.68rem] text-slate-500">
              <span className="chip">ready</span>
              <span className="chip">listening</span>
              <span className="chip">processing</span>
              <span className="chip">error</span>
            </div>
          </div>

          <div className="glass glass-hover rounded-3xl p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10">
              <Languages aria-hidden className="h-5 w-5 text-cyan-300" />
            </span>
            <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-cyan-400/85">
              {t("home.eyebrowLang")}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-50">
              {t("home.langTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {t("home.langBody")}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {(["en", "te", "hi"] as const).map((code) => (
                <div
                  key={code}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center"
                >
                  <Globe aria-hidden className="mx-auto h-3.5 w-3.5 text-teal-400/70" />
                  <p className="mt-1.5 text-sm font-medium text-slate-200">
                    {t(`language.${code}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- safety architecture */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.05fr] md:items-start">
          <div>
            <SectionHeading
              eyebrow={t("home.eyebrowSafety")}
              title={t("home.safetyTitle")}
            />
            <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
              {t("home.safetyBody")}
            </p>

            <div className="mt-8 space-y-3">
              {TRIAGE_LEVELS.map((level) => (
                <div
                  key={level}
                  className="glass flex items-center gap-4 rounded-2xl px-4 py-3"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      level === "emergency"
                        ? "bg-rose-400"
                        : level === "urgent"
                          ? "bg-amber-400"
                          : level === "moderate"
                            ? "bg-cyan-400"
                            : "bg-teal-400"
                    }`}
                  />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-100">
                      {t(triageLabelKey(level))}
                    </span>
                    <span className="truncate text-right text-xs text-slate-500">
                      {t(triageDescriptionKey(level))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gate pipeline diagram */}
          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">
                safety-gate.pipeline
              </p>
              <span className="font-mono text-[0.68rem] text-teal-400">v1.0</span>
            </div>

            <div className="mt-5 space-y-3">
              {gateFlow.map((node, index) => {
                const isStage = index % 2 === 0;
                const isEmergencyNode = node === "pre-scan" || node === "post-scan";
                return (
                  <div key={node}>
                    <div
                      className={
                        isStage
                          ? "rounded-2xl border border-teal-400/25 bg-teal-500/[0.07] px-4 py-3.5 text-center font-mono text-xs tracking-[0.16em] text-teal-200"
                          : "rounded-xl border border-dashed border-rose-400/30 bg-rose-500/[0.05] px-4 py-2 text-center font-mono text-[0.68rem] tracking-[0.14em] text-rose-300/90"
                      }
                    >
                      {node}
                    </div>
                    {index < gateFlow.length - 1 && (
                      <div className="mx-auto h-4 w-px bg-gradient-to-b from-teal-400/40 to-rose-400/30" />
                    )}
                    {isEmergencyNode && index < gateFlow.length - 1 && (
                      <p className="mt-1 text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-rose-400/70">
                        emergency ↧ short-circuit
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: Brain, label: "AI provider", sub: "phase 2" },
                { Icon: Server, label: "Convex", sub: "foundation" },
                { Icon: Globe, label: "i18n", sub: "en · te · hi" },
              ].map(({ Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-center"
                >
                  <Icon aria-hidden className="mx-auto h-4 w-4 text-teal-400/80" />
                  <p className="mt-1.5 text-xs font-medium text-slate-300">{label}</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-slate-600">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- trust */}
      <section className="border-t border-white/[0.05] bg-white/[0.015]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <ul className="hs-stagger grid gap-5 md:grid-cols-3">
            {trustCards.map(({ Icon, titleKey, bodyKey }) => (
              <li key={titleKey} className="glass glass-hover rounded-3xl p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10">
                  <Icon aria-hidden className="h-4 w-4 text-teal-300" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-100">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(bodyKey)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl" />

          <Stethoscope aria-hidden className="mx-auto h-8 w-8 text-teal-300" />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            {t("home.ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {t("home.ctaBody")}
          </p>
          <Link
            to="/ask"
            className="mt-7 inline-flex items-center gap-2.5 rounded-2xl border border-teal-300/50 bg-teal-500/15 px-7 py-3.5 text-sm font-semibold text-teal-50 transition hover:bg-teal-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          >
            {t("home.ctaButton")}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
