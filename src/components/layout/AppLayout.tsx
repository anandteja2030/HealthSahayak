import { useEffect, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { BackgroundFX } from "../fx/BackgroundFX";
import { EmergencyDialog } from "../emergency";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  /** Router outlet when used as a route element; explicit children otherwise. */
  children?: ReactNode;
}

/** Shared shell: backdrop, header, main region, footer, bottom nav, emergency dialog. */
export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  // New pages start at the top, like a native navigation stack.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <BackgroundFX />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:border focus:border-teal-400/50 focus:bg-abyss-900 focus:px-4 focus:py-2 focus:text-sm focus:text-teal-100"
      >
        {t("a11y.skipToContent")}
      </a>

      <AppHeader />

      <main id="main-content" className="flex-1">
        {children ?? <Outlet />}
      </main>

      <AppFooter />
      <BottomNav />
      <EmergencyDialog />
    </div>
  );
}
