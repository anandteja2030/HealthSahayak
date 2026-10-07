import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AskPage } from "./pages/AskPage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { NearbyPage } from "./pages/NearbyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPage } from "./pages/PrivacyPage";

/**
 * Public route table (Phase 1):
 *   /          Home
 *   /ask       Ask a health question
 *   /nearby    Nearby healthcare
 *   /help      Help
 *   /privacy   Privacy
 *   *          NotFound
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
