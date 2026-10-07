import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { EmergencyProvider } from "./components/emergency";
import { LanguageProvider } from "./i18n";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <EmergencyProvider>
          <App />
        </EmergencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
