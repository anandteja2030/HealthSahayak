import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import clsx from "clsx";
import { LOCALE_META, LOCALES, useLanguage, type Locale } from "../i18n";

interface LanguageSelectorProps {
  className?: string;
  /** Render as a compact icon-led control for narrow viewports. */
  compact?: boolean;
}

/** Dropdown switcher for English / Telugu / Hindi. */
export function LanguageSelector({ className, compact = false }: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.selectAria")}
        title={t("language.selectAria")}
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-slate-950/60 text-sm font-medium text-teal-100/90",
          "transition hover:border-teal-300/50 hover:text-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70",
          compact ? "px-2.5 py-2" : "px-3.5 py-2",
        )}
      >
        <Globe aria-hidden className="h-4 w-4 text-teal-300" />
        <span className={clsx(compact && "sr-only sm:not-sr-only")}>
          {LOCALE_META[locale].nativeLabel}
        </span>
        <ChevronDown
          aria-hidden
          className={clsx(
            "h-3.5 w-3.5 text-teal-300/70 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language.label")}
          className="glass-strong hs-rise absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-2xl p-1.5"
        >
          {LOCALES.map((code) => {
            const active = code === locale;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(code)}
                  className={clsx(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                    active
                      ? "bg-teal-500/15 text-teal-100"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span>{t(`language.${code}`)}</span>
                  {active && <Check aria-hidden className="h-4 w-4 text-teal-300" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
