import { BookOpen, Languages, Mic, ShieldCheck } from "lucide-react";
import { useLanguage, type TranslationKey } from "../i18n";
import { SafetyAlert } from "../components/SafetyAlert";

interface FaqItem {
  qKey: TranslationKey;
  aKey: TranslationKey;
}

const FAQ: FaqItem[] = [
  { qKey: "help.faq1Q", aKey: "help.faq1A" },
  { qKey: "help.faq2Q", aKey: "help.faq2A" },
  { qKey: "help.faq3Q", aKey: "help.faq3A" },
];

function HelpCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <article className="glass glass-hover rounded-3xl p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10 text-teal-300">
        {icon}
      </span>
      <h2 className="mt-4 text-base font-semibold text-slate-100">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400"
          >
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-400/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Help page: usage, voice, safety, languages, FAQ — all non-diagnostic. */
export function HelpPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 md:py-14">
      <div className="hs-rise">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
          {t("common.phaseBadge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          {t("help.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
          {t("help.subtitle")}
        </p>
      </div>

      <div className="mt-5">
        <SafetyAlert variant="info" title={t("safety.nonDiagnosticTitle")}>
          {t("safety.nonDiagnosticBody")}
        </SafetyAlert>
      </div>

      <div className="hs-stagger mt-8 grid gap-5 md:grid-cols-2">
        <HelpCard
          icon={<BookOpen aria-hidden className="h-4 w-4" />}
          title={t("help.usingTitle")}
          items={[t("help.using1"), t("help.using2"), t("help.using3")]}
        />
        <HelpCard
          icon={<Mic aria-hidden className="h-4 w-4" />}
          title={t("help.voiceTitle")}
          items={[t("help.voice1"), t("help.voice2"), t("help.voice3")]}
        />
        <HelpCard
          icon={<ShieldCheck aria-hidden className="h-4 w-4" />}
          title={t("help.safetyTitle")}
          items={[t("help.safety1"), t("help.safety2")]}
        />
        <HelpCard
          icon={<Languages aria-hidden className="h-4 w-4" />}
          title={t("help.langTitle")}
          items={[t("help.lang1")]}
        />
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
          {t("help.faqTitle")}
        </p>
        <div className="mt-5 space-y-4">
          {FAQ.map((item) => (
            <div key={item.qKey} className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold text-slate-100">{t(item.qKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {t(item.aKey)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
