import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import clsx from "clsx";
import { useLanguage, type TranslationKey } from "../../i18n";
import { LanguageSelector } from "../LanguageSelector";
import { EmergencyButton } from "../emergency";

const NAV_ITEMS: Array<{ to: string; labelKey: TranslationKey; end?: boolean }> = [
  { to: "/", labelKey: "nav.home", end: true },
  { to: "/ask", labelKey: "nav.ask" },
  { to: "/nearby", labelKey: "nav.nearby" },
  { to: "/help", labelKey: "nav.help" },
  { to: "/privacy", labelKey: "nav.privacy" },
];

function BrandMark() {
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-400/35 bg-teal-500/10 shadow-[0_0_26px_-8px_rgba(45,212,191,0.6)]">
      <Activity aria-hidden className="h-5 w-5 text-teal-300" />
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-300 hs-blink" />
    </span>
  );
}

/** Sticky glass application header. Full navigation on desktop, compact on mobile. */
export function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-abyss-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <NavLink
          to="/"
          className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          aria-label={t("app.name")}
        >
          <BrandMark />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[0.95rem] font-semibold tracking-tight text-slate-50">
              {t("app.name")}
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-teal-400/80">
              {t("common.phaseBadge")}
            </span>
          </span>
        </NavLink>

        <nav
          aria-label={t("nav.main")}
          className="ml-auto hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70",
                  isActive
                    ? "bg-teal-500/12 text-teal-100 shadow-[inset_0_0_0_1px_rgba(45,212,191,0.28)]"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100",
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className={clsx("flex items-center gap-2", "ml-auto md:ml-2")}>
          <LanguageSelector compact />
          <EmergencyButton compact className="sm:hidden" />
          <EmergencyButton className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
