import { useCallback, useEffect, useRef, useState } from "react";
import { LOCALE_META, type Locale, type TranslationKey } from "../i18n";

/**
 * Voice input state machine.
 *
 *  ready ──start()──▶ listening ──final result──▶ processing ──▶ ready
 *     ▲                   │                           │
 *     └───────────────────┴───── error ◀──────────────┘
 */
export type VoiceState = "ready" | "listening" | "processing" | "error";

export type VoiceErrorCode =
  | "unsupported"
  | "microphone-denied"
  | "no-speech"
  | "network"
  | "unknown";

/** Maps a voice error code to its translated message. */
export function voiceErrorKey(code: VoiceErrorCode): TranslationKey {
  switch (code) {
    case "unsupported":
      return "voice.unsupported";
    case "microphone-denied":
      return "voice.micDenied";
    case "no-speech":
      return "voice.noSpeech";
    case "network":
      return "voice.network";
    default:
      return "voice.unknown";
  }
}

interface UseSpeechRecognitionOptions {
  /** Locale used to pick the recognition engine language (en-IN / te-IN / hi-IN). */
  locale?: Locale;
  /** Called while the user is still speaking. */
  onPartialTranscript?: (transcript: string) => void;
  /** Called once per final utterance. */
  onFinalTranscript?: (transcript: string) => void;
  /** Milliseconds spent in `processing` after a final result. */
  processingDelayMs?: number;
}

export interface UseSpeechRecognitionResult {
  state: VoiceState;
  isSupported: boolean;
  error: VoiceErrorCode | null;
  /** Finalized transcript so far (empty until the engine produces one). */
  transcript: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Minimal typings for the (not yet standardized) Web Speech API.
// ---------------------------------------------------------------------------

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  item(index: number): SpeechRecognitionResultLike;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function mapError(code: string): VoiceErrorCode {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "microphone-denied";
    case "no-speech":
      return "no-speech";
    case "network":
    case "audio-capture":
      return "network";
    case "aborted":
      // User/system cancellation is not an error state we surface.
      return "unknown";
    default:
      return "unknown";
  }
}

/**
 * Free, browser-native speech recognition (Web Speech API).
 *
 * No paid voice API is involved. When the browser lacks support the hook
 * reports `isSupported: false` and moves to the `error` state with the
 * `unsupported` code — it never fabricates a transcript.
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionResult {
  const {
    locale = "en",
    onPartialTranscript,
    onFinalTranscript,
    processingDelayMs = 400,
  } = options;

  const [state, setState] = useState<VoiceState>("ready");
  const [error, setError] = useState<VoiceErrorCode | null>(null);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partialRef = useRef(onPartialTranscript);
  const finalRef = useRef(onFinalTranscript);
  useEffect(() => {
    // Keep the latest callbacks available to the long-lived recognition
    // instance without re-creating it on every render.
    partialRef.current = onPartialTranscript;
    finalRef.current = onFinalTranscript;
  });

  const isSupported = getRecognitionCtor() !== null;

  const clearProcessingTimer = useCallback(() => {
    if (processingTimerRef.current !== null) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
  }, []);

  const dispose = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // Already stopped — nothing to do.
      }
    }
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // Ignore — onend still fires and transitions the state.
    }
  }, []);

  const reset = useCallback(() => {
    clearProcessingTimer();
    dispose();
    setState("ready");
    setError(null);
    setTranscript("");
  }, [clearProcessingTimer, dispose]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("unsupported");
      setState("error");
      return;
    }
    if (recognitionRef.current) return; // Already running.

    clearProcessingTimer();
    setError(null);

    const recognition = new Ctor();
    recognition.lang = LOCALE_META[locale].speechLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let finalized = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalized += text;
        } else {
          interim += text;
        }
      }
      if (interim) {
        partialRef.current?.(interim.trim());
      }
      if (finalized) {
        const next = finalized.trim();
        setTranscript(next);
        finalRef.current?.(next);
        setState("processing");
      }
    };

    recognition.onerror = (event) => {
      const mapped = mapError(event.error);
      if (mapped === "unknown" && event.error === "aborted") {
        return; // Deliberate abort (reset/unmount) — no error UI.
      }
      recognitionRef.current = null;
      setError(mapped);
      setState("error");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      clearProcessingTimer();
      processingTimerRef.current = setTimeout(() => {
        processingTimerRef.current = null;
        setState((current) =>
          current === "error" ? current : "ready",
        );
      }, processingDelayMs);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setState("listening");
    } catch {
      recognitionRef.current = null;
      setError("unknown");
      setState("error");
    }
  }, [clearProcessingTimer, locale, processingDelayMs]);

  useEffect(() => {
    return () => {
      clearProcessingTimer();
      dispose();
    };
  }, [clearProcessingTimer, dispose]);

  return { state, isSupported, error, transcript, start, stop, reset };
}
