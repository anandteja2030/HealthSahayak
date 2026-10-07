import { LoaderCircle, Mic, Square, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../i18n";
import { voiceErrorKey, type VoiceErrorCode, type VoiceState } from "./useSpeechRecognition";

interface VoiceButtonProps {
  state: VoiceState;
  isSupported: boolean;
  error?: VoiceErrorCode | null;
  onStart: () => void;
  onStop: () => void;
  onRetry?: () => void;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Microphone button driven entirely by the voice state machine:
 * ready · listening · processing · error.
 *
 * The hook behind it uses the free browser Web Speech API; this component
 * never renders fabricated transcripts.
 */
export function VoiceButton({
  state,
  isSupported,
  error,
  onStart,
  onStop,
  onRetry,
  size = "lg",
  className,
}: VoiceButtonProps) {
  const { t } = useLanguage();

  const label = (() => {
    if (state === "listening") return t("voice.stopListening");
    if (state === "processing") return t("voice.processing");
    if (state === "error") return t(voiceErrorKey(error ?? "unknown"));
    return t("voice.startListening");
  })();

  const handleClick = () => {
    if (state === "listening") {
      onStop();
      return;
    }
    if (state === "error") {
      onRetry?.();
      return;
    }
    if (state === "ready" && isSupported) {
      onStart();
    }
  };

  const disabled = state === "processing" || (state === "ready" && !isSupported);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      data-state={state}
      className={clsx(
        "hs-voice-btn group relative inline-flex shrink-0 items-center justify-center rounded-full",
        "border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70",
        "disabled:cursor-not-allowed disabled:opacity-60",
        size === "lg" ? "h-14 w-14" : "h-11 w-11",
        state === "listening" &&
          "border-teal-400/70 bg-teal-500/20 text-teal-200 shadow-[0_0_28px_rgba(45,212,191,0.35)]",
        state === "ready" &&
          "border-teal-400/30 bg-slate-950/70 text-teal-300 hover:border-teal-300/60 hover:bg-teal-500/10 hover:text-teal-200",
        state === "processing" &&
          "border-cyan-300/50 bg-slate-950/70 text-cyan-200",
        state === "error" &&
          "border-rose-400/50 bg-rose-950/40 text-rose-200 hover:border-rose-300/70",
        className,
      )}
    >
      {state === "listening" && (
        <span aria-hidden className="hs-pulse-ring absolute inset-0 rounded-full border border-teal-300/50" />
      )}
      {state === "listening" && (
        <span aria-hidden className="hs-pulse-ring-delayed absolute inset-0 rounded-full border border-teal-400/30" />
      )}

      {state === "processing" ? (
        <LoaderCircle aria-hidden className="hs-spin h-5 w-5" />
      ) : state === "error" ? (
        <TriangleAlert aria-hidden className="h-5 w-5" />
      ) : state === "listening" ? (
        <Square aria-hidden className="h-4 w-4 fill-current" />
      ) : (
        <Mic aria-hidden className="h-5 w-5" />
      )}

      <span className="sr-only">{label}</span>
    </button>
  );
}
