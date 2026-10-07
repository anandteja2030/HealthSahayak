import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { useLanguage, type TranslationKey } from "../../i18n";

const EXPLORE_LINKS: Array<{ to: string; labelKey: TranslationKey }> = [
  { to: "/", labelKey: "nav.home" },
  { to: "/ask", labelKey: "nav.ask" },
  { to: "/nearby", labelKey: "nav.nearby" },
  { to: "/help", labelKey: "nav.help" },
];

const LEGAL_LINKS: Array<{ to: string; labelKey: TranslationKey }> = [
  { to: "/privacy", labelKey: "nav.privacy" },
];

export function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/[0.06] bg-abyss-950/60 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10">
              <Activity aria-hidden className="h-4 w-4 text-teal-300" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-100">{t("app.name")}</p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-teal-400/75">
                {t("footer.phase")}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("footer.tagline")}
          </p>
          <p className="mt-4 max-w-md rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-400">
            {t("footer.disclaimer")}
          </p>
        </div>

        <nav aria-label={t("footer.explore")}>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">
            {t("footer.explore")}
          </p>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-400 transition hover:text-teal-200"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("footer.legal")}>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">
            {t("footer.legal")}
          </p>
          <ul className="mt-4 space-y-2.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-400 transition hover:text-teal-200"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
