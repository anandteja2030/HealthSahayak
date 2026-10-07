/**
 * English dictionary — the source of truth for translation keys.
 *
 * `TranslationKey` is derived from this object, so every other locale
 * (typed as `Record<TranslationKey, string>`) must implement exactly the
 * same key set or the build fails.
 */
export const en = {
  // ---------------------------------------------------------------- chrome
  "app.name": "HealthSahayak",
  "app.tagline": "Voice-first health navigation",
  "a11y.skipToContent": "Skip to content",

  // ------------------------------------------------------------ navigation
  "nav.home": "Home",
  "nav.ask": "Ask Health Question",
  "nav.askShort": "Ask",
  "nav.nearby": "Nearby Healthcare",
  "nav.nearbyShort": "Nearby",
  "nav.help": "Help",
  "nav.privacy": "Privacy",
  "nav.emergency": "Emergency",
  "nav.main": "Main navigation",

  // -------------------------------------------------------------- language
  "language.label": "Language",
  "language.selectAria": "Select language",
  "language.en": "English",
  "language.te": "తెలుగు",
  "language.hi": "हिन्दी",

  // --------------------------------------------------------------- common
  "common.phaseBadge": "PHASE 1 · FOUNDATION",
  "common.backHome": "Back to home",

  // ----------------------------------------------------------------- home
  "home.eyebrow": "MULTILINGUAL · VOICE-FIRST · SAFETY-GATED",
  "home.headline": "Tell us what you're feeling.",
  "home.subhead":
    "Describe a health concern in your own words — by voice or text — and get general health information, an urgency sense-check, and guidance toward the right care, in English, Telugu, or Hindi.",
  "home.ctaSpeak": "Speak your health problem",
  "home.ctaType": "Type your health problem",

  "console.safety": "SAFETY GATE · ACTIVE",
  "console.locales": "LOCALES · EN · TE · HI",
  "console.provider": "AI PROVIDER · NOT CONNECTED",
  "console.voice": "VOICE · BROWSER NATIVE",

  "home.eyebrowHow": "How it works",
  "home.howTitle": "Three steps, one safe path",
  "home.step1Title": "Describe your concern",
  "home.step1Body":
    "Speak or type what you are feeling, in the language you think in.",
  "home.step2Title": "Check the urgency",
  "home.step2Body":
    "A safety layer classifies how soon you should act — before any AI answer can reach you.",
  "home.step3Title": "Navigate to care",
  "home.step3Body":
    "Understand what level of care fits your situation, and (in later phases) find facilities near you.",

  "home.eyebrowVoice": "Voice-first",
  "home.voiceTitle": "Built for speaking, not just typing",
  "home.voiceBody":
    "Microphone capture runs through your browser's built-in speech engine — free, with no paid voice APIs, and available anywhere your browser supports recognition.",

  "home.eyebrowLang": "Languages",
  "home.langTitle": "Three languages, one experience",
  "home.langBody":
    "English, తెలుగు, and हिन्दी — with translated navigation, interface copy, and safety messages.",

  "home.eyebrowSafety": "Safety-first design",
  "home.safetyTitle": "Emergency handling cannot be bypassed",
  "home.safetyBody":
    "Every question passes through a triage gate before and after any future AI provider. Emergency-level input short-circuits the provider entirely; emergency-level output is discarded. The model never gets the final say.",
  "home.trust1Title": "Safety-gated",
  "home.trust1Body": "Triage runs before and after every answer.",
  "home.trust2Title": "Non-diagnostic",
  "home.trust2Body":
    "General health information — never a diagnosis or a prescription.",
  "home.trust3Title": "Private by default",
  "home.trust3Body":
    "No account needed. Your language preference stays on your device.",

  "home.ctaTitle": "Ready when you are.",
  "home.ctaBody": "Describe your first concern — by voice or text.",
  "home.ctaButton": "Start now",

  // --------------------------------------------------------------- triage
  "triage.low": "Low",
  "triage.moderate": "Moderate",
  "triage.urgent": "Urgent",
  "triage.emergency": "Emergency",
  "triage.lowDesc": "General information is enough",
  "triage.moderateDesc": "Monitor it and consider care",
  "triage.urgentDesc": "Seek care soon",
  "triage.emergencyDesc": "Act immediately",

  // ---------------------------------------------------------------- voice
  "voice.ready": "Ready",
  "voice.listening": "Listening…",
  "voice.processing": "Processing…",
  "voice.error": "Voice error",
  "voice.startListening": "Start voice input",
  "voice.stopListening": "Stop listening",
  "voice.unsupported":
    "Voice input isn't supported in this browser. Try Chrome or Edge, or type your concern instead.",
  "voice.micDenied":
    "Microphone access was blocked. Allow the microphone to speak, or type instead.",
  "voice.noSpeech": "We couldn't hear anything. Please try again.",
  "voice.network":
    "The speech service is unavailable. Check your connection or type instead.",
  "voice.unknown":
    "Something went wrong with voice input. Please try again or type instead.",

  // --------------------------------------------------------------- safety
  "safety.nonDiagnosticTitle": "General information only",
  "safety.nonDiagnosticBody":
    "HealthSahayak cannot diagnose or prescribe. In an emergency, call your local emergency number now.",
  "safety.emergencyTitle": "Emergency",
  "safety.emergencyBody":
    "If you or someone near you is in immediate danger, call your local emergency number now — 112 in India. Do not wait for an app response.",
  "safety.emergencyAction": "Call 112",
  "safety.blockedTitle": "Response blocked by the safety gate",
  "safety.blockedBody":
    "Emergency-level indicators were detected, so no AI-generated answer was shown.",

  // ------------------------------------------------------------ emergency
  "emergency.title": "Emergency help",
  "emergency.body":
    "HealthSahayak cannot assess emergencies. If you believe this may be an emergency:",
  "emergency.step1": "Call your local emergency number now — 112 in India.",
  "emergency.step2":
    "Stay with the person while help arrives, if it is safe for you.",
  "emergency.step3":
    "If you can travel safely, go to the nearest emergency department.",
  "emergency.close": "Close",
  "emergency.call": "Call 112",

  // ----------------------------------------------------------------- ask
  "ask.title": "Ask a health question",
  "ask.subtitle": "Describe what you are feeling. Voice or text both work.",
  "ask.inputLabel": "Your health concern",
  "ask.placeholder": "Describe your symptom or concern…",
  "ask.voiceHint": "Tap the microphone and speak — English, Telugu, or Hindi.",
  "ask.send": "Send",
  "ask.conversationLabel": "Conversation",
  "ask.emptyTitle": "Nothing here yet",
  "ask.emptyBody":
    "Type or speak your health concern to start. Nothing is stored after you leave this page.",
  "ask.loadingTitle": "Processing…",
  "ask.loadingBody": "Running your message through the safety gate.",
  "ask.errorTitle": "Something went wrong",
  "ask.errorBody":
    "We could not process that just now. Please try again.",
  "ask.retry": "Try again",
  "ask.requiredError": "Please describe your health concern first.",
  "ask.unavailableTitle": "No guidance provider connected",
  "ask.unavailableBody":
    "Phase 1 ships the foundation only — no AI provider is connected, so no medical answer is generated. Guidance will appear here in a later phase.",
  "ask.you": "You",
  "ask.assistant": "HealthSahayak",

  // -------------------------------------------------------------- nearby
  "nearby.title": "Nearby healthcare",
  "nearby.subtitle": "Find clinics, hospitals, and pharmacies around you.",
  "nearby.emptyTitle": "No facilities listed yet",
  "nearby.emptyBody":
    "Phase 1 ships the foundation only. Healthcare listings will come from verified public sources in a later phase — HealthSahayak never seeds fake hospitals, clinics, or doctors.",
  "nearby.emptyNote":
    "Location access has not been requested and nothing has been collected.",
  "nearby.browseButton": "Ask a question instead",

  // ---------------------------------------------------------------- help
  "help.title": "Help & how it works",
  "help.subtitle": "Everything you need to use HealthSahayak safely.",
  "help.usingTitle": "Using HealthSahayak",
  "help.using1": "Choose Home, Ask, or Nearby from the navigation.",
  "help.using2":
    "On Ask, type your concern or tap the microphone and speak.",
  "help.using3":
    "Read the urgency guidance and act on it — the app never replaces a clinician.",
  "help.voiceTitle": "Voice tips",
  "help.voice1":
    "Tap the microphone and speak naturally in English, Telugu, or Hindi.",
  "help.voice2":
    "Speech recognition needs browser support (Chrome or Edge recommended) and microphone permission.",
  "help.voice3": "If voice is unavailable, you can always type instead.",
  "help.safetyTitle": "Safety",
  "help.safety1":
    "HealthSahayak gives general health information, never a diagnosis.",
  "help.safety2":
    "In an emergency, call 112 in India or your local emergency number immediately.",
  "help.langTitle": "Languages",
  "help.lang1":
    "Switch languages any time with the selector in the header — navigation and messages update instantly.",
  "help.faqTitle": "FAQ",
  "help.faq1Q": "Is HealthSahayak a doctor?",
  "help.faq1A":
    "No. It offers general health information and navigation help. Only a qualified professional can diagnose or treat you.",
  "help.faq2Q": "Does it give medical answers yet?",
  "help.faq2A":
    "Not yet. Phase 1 is the foundation: pages, languages, voice, and safety architecture. AI guidance arrives in a later phase.",
  "help.faq3Q": "Is my data stored?",
  "help.faq3A":
    "Phase 1 stores only your language preference in your browser. There is no account and no health record.",

  // ------------------------------------------------------------- privacy
  "privacy.title": "Privacy policy",
  "privacy.updated": "Applies to Phase 1 · October 2026",
  "privacy.intro":
    "HealthSahayak is in its Phase 1 foundation stage. This policy describes exactly what happens today.",
  "privacy.storageTitle": "What is stored",
  "privacy.storageBody":
    "Your selected language is saved in your browser's local storage so it persists between visits. Nothing else is written to your device or sent anywhere.",
  "privacy.voiceTitle": "Voice input",
  "privacy.voiceBody":
    "Speech recognition uses your browser's built-in speech engine and is only requested when you tap the microphone. How audio is handled is governed by your browser and its speech provider.",
  "privacy.accountsTitle": "Accounts and health records",
  "privacy.accountsBody":
    "Phase 1 has no sign-up, no login, and no health records. There is nothing to delete, because nothing is kept.",
  "privacy.backendTitle": "Backend",
  "privacy.backendBody":
    "A Convex backend foundation is wired up but stores no data in Phase 1.",
  "privacy.policyTitle": "What will not change",
  "privacy.policyBody":
    "No selling personal data, no fake medical records, no fake providers, and no paid trackers in Phase 1. Later phases will update this policy before they ship.",
  "privacy.contactTitle": "Contact",
  "privacy.contactBody":
    "Questions or concerns? Open an issue on the HealthSahayak GitHub repository.",

  // ------------------------------------------------------------ not found
  "notFound.code": "404",
  "notFound.title": "This page does not exist",
  "notFound.body": "The link may be broken, or the page may have moved.",
  "notFound.action": "Back to home",

  // -------------------------------------------------------------- footer
  "footer.tagline": "Multilingual, voice-first health navigation.",
  "footer.disclaimer":
    "HealthSahayak is an information tool, not a medical professional. In an emergency, call your local emergency number.",
  "footer.explore": "Explore",
  "footer.legal": "Legal",
  "footer.phase": "Phase 1 · Foundation",
} as const;

export type TranslationKey = keyof typeof en;
