import { NavLink } from "react-router-dom";
import { House, MapPin, MessagesSquare, Siren, Stethoscope, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { useLanguage, type TranslationKey } from "../../i18n";
import { useEmergency } from "../emergency";

const ITEMS: Array<{
  to: string;
  labelKey: TranslationKey;
  Icon: LucideIcon;
  end?: boolean;
}> = [
  { to: "/", labelKey: "nav.home", Icon: House, end: true },
  { to: "/ask", labelKey: "nav.askShort", Icon: Stethoscope },
  { to: "/nearby", labelKey: "nav.nearbyShort", Icon: MapPin },
  { to: "/help", labelKey: "nav.help", Icon: MessagesSquare },
];

/**
 * Mobile primary navigation. Emergency is a trigger (not a route) so it
 * opens the same alert dialog as the header on every screen.
 */
export function BottomNav() {
  const { t } = useLanguage();
  const { openEmergency } = useEmergency();

  return (
    <nav
      aria-label={t("nav.main")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-abyss-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-1.5">
        {ITEMS.map(({ to, labelKey, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-[0.64rem] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70",
                  isActive
                    ? "bg-teal-500/12 text-teal-100"
                    : "text-slate-400 hover:text-slate-200",
                )
              }
            >
              <Icon aria-hidden className="h-[1.15rem] w-[1.15rem]" />
              <span className="truncate max-w-full">{t(labelKey)}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={openEmergency}
            aria-label={t("nav.emergency")}
            className="flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-[0.64rem] font-semibold text-rose-300 transition hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
          >
            <Siren aria-hidden className="h-[1.15rem] w-[1.15rem]" />
            <span className="truncate max-w-full">{t("nav.emergency")}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
