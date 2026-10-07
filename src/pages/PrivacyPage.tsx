import { Database, FileText, Lock, Mic, Scale, UserRoundX } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage, type TranslationKey } from "../i18n";

interface PolicySection {
  icon: ReactNode;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}

/** Privacy policy describing the actual Phase 1 behavior — no promises beyond it. */
export function PrivacyPage() {
  const { t } = useLanguage();

  const sections: PolicySection[] = [
    {
      icon: <FileText aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.storageTitle",
      bodyKey: "privacy.storageBody",
    },
    {
      icon: <Mic aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.voiceTitle",
      bodyKey: "privacy.voiceBody",
    },
    {
      icon: <UserRoundX aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.accountsTitle",
      bodyKey: "privacy.accountsBody",
    },
    {
      icon: <Database aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.backendTitle",
      bodyKey: "privacy.backendBody",
    },
    {
      icon: <Scale aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.policyTitle",
      bodyKey: "privacy.policyBody",
    },
    {
      icon: <Lock aria-hidden className="h-4 w-4" />,
      titleKey: "privacy.contactTitle",
      bodyKey: "privacy.contactBody",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      <div className="hs-rise">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
          {t("privacy.updated")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          {t("privacy.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          {t("privacy.intro")}
        </p>
      </div>

      <div className="hs-stagger mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <article key={section.titleKey} className="glass rounded-3xl p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10 text-teal-300">
              {section.icon}
            </span>
            <h2 className="mt-4 text-base font-semibold text-slate-100">
              {t(section.titleKey)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {t(section.bodyKey)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
