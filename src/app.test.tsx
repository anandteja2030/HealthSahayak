import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { EmergencyProvider } from "./components/emergency";
import { LanguageProvider } from "./i18n";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <EmergencyProvider>
          <App />
        </EmergencyProvider>
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("App routes", () => {
  it("renders the home landing page with headline and safety notice", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /tell us what you're feeling/i }),
    ).toBeTruthy();
    expect(screen.getByText(/cannot diagnose or prescribe/i)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /speak your health problem/i }),
    ).toBeTruthy();
  });

  it("renders the Ask page foundation with empty state and composer", () => {
    renderAt("/ask");
    expect(screen.getByRole("heading", { level: 1, name: /ask a health question/i })).toBeTruthy();
    expect(screen.getByText(/nothing here yet/i)).toBeTruthy();
    expect(screen.getByRole("log", { name: /conversation/i })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /your health concern/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /send/i })).toBeTruthy();
  });

  it("renders the privacy policy page", () => {
    renderAt("/privacy");
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeTruthy();
    expect(screen.getByText(/no sign-up, no login/i)).toBeTruthy();
  });

  it("renders the nearby empty state without any fabricated providers", () => {
    const { container } = renderAt("/nearby");
    expect(screen.getByRole("heading", { level: 1, name: /nearby healthcare/i })).toBeTruthy();
    expect(screen.getByText(/no facilities listed yet/i)).toBeTruthy();
    expect(container.textContent).not.toMatch(/Sharma Clinic|City Hospital/);
  });

  it("routes unknown paths to the translated NotFound page", () => {
    renderAt("/definitely-not-a-route");
    expect(screen.getByText("404")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: /does not exist/i })).toBeTruthy();
  });
});

describe("Language architecture", () => {
  it("switches the UI to Telugu from the header selector", () => {
    renderAt("/");

    fireEvent.click(screen.getByRole("button", { name: /select language/i }));
    fireEvent.click(screen.getByRole("button", { name: "తెలుగు" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "మీకు ఎలా అనిపిస్తోందో మాకు చెప్పండి." }),
    ).toBeTruthy();
    expect(document.documentElement.lang).toBe("te");
  });

  it("switches the UI to Hindi", () => {
    renderAt("/ask");

    fireEvent.click(screen.getByRole("button", { name: /select language/i }));
    fireEvent.click(screen.getByRole("button", { name: "हिन्दी" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "स्वास्थ्य प्रश्न पूछें" }),
    ).toBeTruthy();
  });
});

describe("Emergency handling", () => {
  it("opens the emergency alert dialog from the header button", () => {
    renderAt("/");

    // Header and bottom nav both expose an Emergency trigger (bottom nav is
    // hidden by CSS on desktop, but both exist in the DOM under jsdom).
    fireEvent.click(screen.getAllByRole("button", { name: "Emergency" })[0]);

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeTruthy();
    expect(screen.getByText(/112 in India/i)).toBeTruthy();
  });
});
