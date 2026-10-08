# HealthSahayak

**A multilingual, voice-first health information and healthcare-navigation web app.**
People describe a health concern in their own language — by voice or text — and receive
general health information, an urgency sense-check, and guidance toward the right care.

Supported languages: **English · Telugu (తెలుగు) · Hindi (हिन्दी)**

> 🩺 **Non-diagnostic by design.** HealthSahayak provides general health information only.
> It cannot diagnose, prescribe, or replace a qualified healthcare professional. 
> In an emergency, call your local emergency number (112 in India).

---

## Phase 1 status

Phase 1 is the **foundation**: product shell, public pages, i18n, voice architecture,
and the safety-first architecture. It intentionally does **not** include:

- ❌ any AI/LLM provider (Gemini or otherwise) or paid APIs
- ❌ fabricated medical answers, citations, hospitals, doctors, or clinics
- ❌ authentication or user accounts
- ❌ the RAG system

## Tech stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Frontend   | React 19 + TypeScript 6 + Vite 8                          |
| Styling    | Tailwind CSS 4 (dark, teal/cyan, glassmorphism, grid FX)  |
| Routing    | React Router v7                                           |
| i18n       | Custom dictionary + `LanguageContext` (en / te / hi)      |
| Voice      | Browser Web Speech API (free, no paid voice APIs)         |
| Safety     | Pure-TS triage gate (`src/safety`)                        |
| Backend    | Convex (foundation only — no data stored in Phase 1)      |
| Tests      | Vitest + Testing Library (22 tests)                       |
| Lint       | ESLint 10 + typescript-eslint + react-hooks               |
| Package mgmt | Bun                                                     |

## Getting started

```bash
bun install
bun run dev        # dev server (binds 0.0.0.0, PORT-aware, HMR disabled per Freebuff)
```

| Script              | Command             |
| ------------------- | ------------------- |
| Dev server          | `bun run dev`       |
| Typecheck           | `bun tsc -b --noEmit` |
| Lint                | `bun run lint`      |
| Tests               | `bun run test`      |
| Production build    | `bun run build`     |

## Route structure

| Route     | Page                | Notes                                                     |
| --------- | ------------------- | --------------------------------------------------------- |
| `/`       | `HomePage`          | Landing: hero, how-it-works, voice/languages, safety, CTA |
| `/ask`    | `AskPage`           | Conversation, composer, voice button, empty/loading/error |
| `/nearby` | `NearbyPage`        | Honest empty state — no fabricated providers              |
| `/help`   | `HelpPage`          | Usage, voice tips, safety, FAQ (all non-diagnostic)       |
| `/privacy`| `PrivacyPage`       | Describes exactly what Phase 1 stores (language only)     |
| `*`       | `NotFoundPage`      | Translated 404                                            |

All routes render inside `AppLayout`:

```
AppLayout
├── BackgroundFX        (grid + glow backdrop, decorative, aria-hidden)
├── AppHeader           (brand, nav, LanguageSelector, EmergencyButton)
├── <Outlet />          (page content)
├── AppFooter           (links + safety disclaimer)
├── BottomNav           (mobile: Home · Ask · Nearby · Help · Emergency)
└── EmergencyDialog     (alert dialog, opened from any surface)
```

## Architecture

```
src/
├── i18n/                  Language foundation
│   ├── dictionaries/      en.ts (source of truth) · te.ts · hi.ts
│   ├── locales.ts         LOCALES, speech BCP-47 tags, native labels
│   └── LanguageContext.tsx  LanguageProvider + useLanguage() → { t, locale, setLocale }
├── voice/                 Voice foundation
│   ├── useSpeechRecognition.ts   state machine: ready → listening → processing → error
│   └── VoiceButton.tsx           visual control for the four states
├── safety/                Safety-first triage boundary ⭐
│   ├── types.ts           TriageLevel, SafetyRule, GuidanceProvider, gate types
│   ├── rules.ts           rule registry (Phase 1: intentionally empty)
│   ├── gate.ts            assessText() + runSafetyGate()  ← the ordering guarantee
│   └── labels.ts          triage level → translation key
├── services/
│   └── guidance.ts        Phase 1 stub provider (returns null — no invented answers)
├── components/
│   ├── layout/            AppLayout · AppHeader · AppFooter · BottomNav
│   ├── emergency/         EmergencyContext · EmergencyDialog · EmergencyButton
│   ├── fx/BackgroundFX.tsx
│   ├── LanguageSelector.tsx
│   └── SafetyAlert.tsx    info / warning / emergency / blocked variants
└── pages/                 HomePage · AskPage · NearbyPage · HelpPage · PrivacyPage · NotFoundPage
convex/
└── healthcheck.ts         non-medical ping query (foundation only)
```

## Language architecture (i18n)

- `src/i18n/dictionaries/en.ts` defines every key and derives the `TranslationKey` union.
- `te.ts` and `hi.ts` are typed `Record<TranslationKey, string>` — **a missing or extra key
  is a compile-time error**, and `dictionaries.test.ts` re-verifies parity at runtime.
- `LanguageProvider` persists the choice to `localStorage`
  (`healthsahayak.locale`), detects the browser language as a fallback, and sets
  `<html lang>` on change.
- Components never hardcode user-facing strings; they call `t("some.key")`.
- The selected locale also drives the speech engine (`en-IN` / `te-IN` / `hi-IN`).

## Voice architecture

`useSpeechRecognition()` wraps the **free browser Web Speech API** (no paid APIs):

- States: `ready → listening → processing → error` (plus `isSupported` detection).
- `VoiceButton` renders each state (mic, pulsing stop, spinner, retry-on-error).
- Errors map to translated messages: unsupported browser, blocked microphone,
  no speech detected, network, unknown.
- **No fake transcription**: if the browser can't hear or doesn't support speech, the
  hook reports an error — it never invents text.

## Safety-first design ⭐

All questions flow through `runSafetyGate()` in `src/safety/gate.ts`. The ordering is the
guarantee, and it lives in the gate — not in any provider:

```
1. INPUT scan     — ALWAYS runs first. Emergency-level input short-circuits:
                    the AI provider is never invoked.
2. Provider call  — only reachable below emergency level.
3. OUTPUT scan    — ALWAYS runs after the provider. Emergency-level output
                    (detected or claimed by the model) is discarded.
```

- Triage levels: `low · moderate · urgent · emergency`, escalation-only
  (`highestLevel()` can never downgrade).
- The provider may only **suggest** urgency; the gate computes the final level.
- The emergency UI (`SafetyAlert`, `EmergencyDialog`) is rendered by the app shell,
  outside any AI output — a future provider cannot suppress it.
- `DEFAULT_RULES` ships **empty**: Phase 1 invents no medical rules. A later phase
  populates it with clinician-reviewed, locale-specific indicators; the gate logic
  does not change when rules land.

Unit tests in `src/safety/gate.test.ts` prove the guarantees with synthetic
(non-medical) rules: emergency input blocks *before* the provider, emergency output is
discarded, and a provider claiming emergency never leaks an answer.

## Future AI / RAG provider boundary

The only integration point for future guidance is the `GuidanceProvider` interface:

```ts
interface GuidanceProvider {
  id: string;
  ask(request: { question: string; locale: string }): Promise<ProviderAnswer | null>;
}
```

- Phase 1 ships `phase1Provider` (`src/services/guidance.ts`) which returns `null`;
  the UI renders a translated "guidance not connected" notice instead of an answer.
- A later phase (e.g. Gemini + RAG) implements this interface **and is only called via
  `runSafetyGate()`** — the Ask page never talks to a provider directly. That is what
  makes emergency handling impossible for an AI provider to bypass.

## Convex

- `convex/` holds the foundation only: a non-medical `healthcheck.ping` query.
- No fake medical records, hospitals, doctors, clinics, or content are seeded.
- ⚠️ **Codegen note:** `convex/_generated/` could not be produced in this sandbox —
  `convex dev --once` fails because the local backend binary requires glibc ≥ 2.38
  (host: 2.35) and `convex codegen` requires an authenticated deployment. On a
  compatible machine, run `bun convex dev --once` once to generate `convex/_generated`
  and commit it (the Convex CLI does this automatically).
- The app itself does not depend on Convex yet; `tsconfig.json` covers `src/`.

## Verification (Phase 1)

| Check        | Result                                       |
| ------------ | -------------------------------------------- |
| TypeScript   | `tsc -b --noEmit` ✅                          |
| Tests        | `vitest run` — 22/22 ✅ (safety, i18n, app)  |
| Lint         | `eslint .` — 0 errors, 0 warnings ✅          |
| Build        | `vite build` → `dist/` ✅                     |
| Preview      | `freebuff-preview start` — ready, HTTP 200 ✅ |
| Convex       | dependency + foundation source ✅; codegen ⚠️ blocked in sandbox (see above) |

## Roadmap

- **Phase 1** — foundation: pages, i18n, voice, safety architecture ✅ *(this phase)*
- Phase 2 — AI guidance provider behind the safety gate (no paid APIs until approved)
- Phase 3 — clinician-reviewed safety rules (en/te/hi), triage UX
- Phase 4 — verified nearby healthcare from public sources
- Phase 5 — authentication and personalization
