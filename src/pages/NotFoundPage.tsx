import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n";

/** Catch-all route for unknown paths. */
export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="hs-rise font-mono text-7xl font-semibold text-teal-400/30 sm:text-8xl">
        {t("notFound.code")}
      </p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-50">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {t("notFound.body")}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2.5 rounded-2xl border border-teal-300/45 bg-teal-500/15 px-6 py-3.5 text-sm font-semibold text-teal-50 transition hover:bg-teal-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        {t("notFound.action")}
      </Link>
    </div>
  );
}
