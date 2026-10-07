import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CircleAlert,
  Info,
  Lock,
  Send,
  ShieldX,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../i18n";
import { SafetyAlert } from "../components/SafetyAlert";
import { VoiceButton, useSpeechRecognition, voiceErrorKey } from "../voice";
import { runSafetyGate } from "../safety";
import { phase1Provider } from "../services/guidance";

type Message =
  | { id: number; role: "user"; kind: "text"; text: string }
  | { id: number; role: "assistant"; kind: "text"; text: string }
  | { id: number; role: "assistant"; kind: "unavailable" }
  | { id: number; role: "assistant"; kind: "blocked" }
  | { id: number; role: "assistant"; kind: "error" };

type Status = "idle" | "loading";

let messageId = 0;
const nextId = () => (messageId += 1);

/**
 * Ask page foundation (Phase 1): conversation container, composer, voice
 * button, and safe empty/loading/error states. Questions run through the
 * safety gate; with no AI provider connected the result is a translated
 * "guidance not connected" notice — never an invented medical answer.
 */
export function AskPage() {
  const { t, locale } = useLanguage();
  const [searchParams] = useSearchParams();
  const wantsVoice = searchParams.get("mode") === "voice";

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [interim, setInterim] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState(false);
  const lastQuestionRef = useRef("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const recognition = useSpeechRecognition({
    locale,
    onPartialTranscript: (text) => setInterim(text),
    onFinalTranscript: (text) => {
      setInterim("");
      setValidationError(false);
      setDraft((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
    },
  });

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question) {
        setValidationError(true);
        return;
      }
      setValidationError(false);
      lastQuestionRef.current = question;
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", kind: "text", text: question },
      ]);
      setDraft("");
      setInterim("");
      setStatus("loading");

      try {
        const result = await runSafetyGate(
          { question, locale },
          phase1Provider,
        );
        setMessages((prev) => {
          if (result.blocked) {
            return [...prev, { id: nextId(), role: "assistant", kind: "blocked" }];
          }
          if (result.reason === "no-answer" || !result.answer) {
            return [...prev, { id: nextId(), role: "assistant", kind: "unavailable" }];
          }
          return [
            ...prev,
            { id: nextId(), role: "assistant", kind: "text", text: result.answer.text },
          ];
        });
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", kind: "error" },
        ]);
      } finally {
        setStatus("idle");
      }
    },
    [locale],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void submit(draft);
  };

  const onRetry = () => void submit(lastQuestionRef.current);

  const voiceCaption = (() => {
    if (recognition.state === "error" && recognition.error) {
      return { text: t(voiceErrorKey(recognition.error)), tone: "text-rose-300" };
    }
    if (recognition.state === "listening") {
      return { text: t("voice.listening"), tone: "text-teal-300" };
    }
    if (recognition.state === "processing") {
      return { text: t("voice.processing"), tone: "text-cyan-300" };
    }
    return { text: t("voice.ready"), tone: "text-slate-500" };
  })();

  // Partial transcripts are only surfaced while actively listening.
  const visibleInterim = recognition.state === "listening" ? interim : "";

  const isEmpty = messages.length === 0 && status === "idle";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      {/* ------------------------------------------------------ page head */}
      <div className="hs-rise">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-teal-400/85">
          {t("common.phaseBadge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          {t("ask.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
          {t("ask.subtitle")}
        </p>
      </div>

      <div className="mt-5">
        <SafetyAlert variant="info" title={t("safety.nonDiagnosticTitle")}>
          {t("safety.nonDiagnosticBody")}
        </SafetyAlert>
      </div>

      {wantsVoice && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-500/[0.07] px-4 py-2 text-xs text-teal-200">
          <Sparkles aria-hidden className="h-3.5 w-3.5" />
          {t("ask.voiceHint")}
        </p>
      )}

      {/* ------------------------------------------------- conversation */}
      <div className="glass mt-6 flex h-[26rem] flex-col overflow-hidden rounded-3xl sm:h-[32rem]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-500">
            <Stethoscope aria-hidden className="h-3.5 w-3.5 text-teal-400/80" />
            {t("ask.conversationLabel")}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.64rem] text-slate-600">
            <Lock aria-hidden className="h-3 w-3" />
            session-only
          </span>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-label={t("ask.conversationLabel")}
          aria-live="polite"
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
        >
          {/* Safe empty state */}
          {isEmpty && (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-400/25 bg-teal-500/[0.07]">
                <Stethoscope aria-hidden className="h-6 w-6 text-teal-300/90" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-slate-200">
                {t("ask.emptyTitle")}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                {t("ask.emptyBody")}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 font-mono text-[0.64rem] text-slate-600">
                <span className="chip">input → safety-gate → provider</span>
                <span className="chip">provider: null</span>
              </div>
            </div>
          )}

          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md border border-teal-400/25 bg-teal-500/[0.1] px-4 py-3">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-teal-400/70">
                      {t("ask.you")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-100">
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex justify-start">
                <div className="w-full max-w-[92%] space-y-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-600">
                    {t("ask.assistant")}
                  </p>

                  {message.kind === "text" && (
                    <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">
                        {message.text}
                      </p>
                    </div>
                  )}

                  {message.kind === "unavailable" && (
                    <div className="rounded-2xl rounded-bl-md border border-amber-400/25 bg-amber-500/[0.06] px-4 py-3">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                        <Info aria-hidden className="h-4 w-4" />
                        {t("ask.unavailableTitle")}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                        {t("ask.unavailableBody")}
                      </p>
                      <Link
                        to="/help"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 underline-offset-4 hover:underline"
                      >
                        {t("nav.help")} →
                      </Link>
                    </div>
                  )}

                  {message.kind === "blocked" && (
                    <SafetyAlert variant="blocked" title={t("safety.blockedTitle")}>
                      {t("safety.blockedBody")}
                    </SafetyAlert>
                  )}

                  {message.kind === "error" && (
                    <div
                      role="alert"
                      className="rounded-2xl rounded-bl-md border border-rose-400/30 bg-rose-500/[0.07] px-4 py-3"
                    >
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-rose-200">
                        <CircleAlert aria-hidden className="h-4 w-4" />
                        {t("ask.errorTitle")}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                        {t("ask.errorBody")}
                      </p>
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                      >
                        {t("ask.retry")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading state */}
          {status === "loading" && (
            <div className="flex justify-start">
              <div className="w-full max-w-[92%]">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-600">
                  {t("ask.assistant")}
                </p>
                <div className="mt-2 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
                  <p className="text-sm font-medium text-slate-300">
                    <span className="hs-blink">●</span> {t("ask.loadingTitle")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{t("ask.loadingBody")}</p>
                  <div className="mt-3 space-y-2" aria-hidden>
                    <div className="hs-skeleton h-2.5 w-4/5 rounded-full" />
                    <div className="hs-skeleton h-2.5 w-3/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- composer */}
        <form
          onSubmit={onSubmit}
          className="border-t border-white/[0.06] bg-abyss-950/50 px-4 py-4 sm:px-6"
        >
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="ask-input" className="sr-only">
                {t("ask.inputLabel")}
              </label>
              <textarea
                id="ask-input"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (validationError) setValidationError(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit(draft);
                  }
                }}
                rows={2}
                aria-invalid={validationError || undefined}
                aria-describedby={validationError ? "ask-input-error" : undefined}
                placeholder={t("ask.placeholder")}
                className={clsx(
                  "w-full resize-none rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-slate-100",
                  "placeholder:text-slate-600 focus:outline-none focus:ring-2",
                  validationError
                    ? "border-rose-400/50 focus:border-rose-400/70 focus:ring-rose-400/30"
                    : "border-white/[0.1] focus:border-teal-400/50 focus:ring-teal-400/25",
                )}
              />
              {visibleInterim && (
                <p className="mt-1.5 truncate text-xs italic text-teal-300/70" aria-hidden>
                  {visibleInterim}
                </p>
              )}
              {validationError && (
                <p
                  id="ask-input-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-rose-300"
                >
                  {t("ask.requiredError")}
                </p>
              )}
            </div>

            <VoiceButton
              state={recognition.state}
              isSupported={recognition.isSupported}
              error={recognition.error}
              onStart={recognition.start}
              onStop={recognition.stop}
              onRetry={recognition.reset}
              size="lg"
              className="mb-0.5"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              aria-label={t("ask.send")}
              className={clsx(
                "mb-0.5 inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70",
                status === "loading"
                  ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-slate-600"
                  : "border border-teal-300/45 bg-teal-500/15 text-teal-50 hover:bg-teal-500/25",
              )}
            >
              <Send aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">{t("ask.send")}</span>
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <p className={clsx("inline-flex items-center gap-2 text-xs", voiceCaption.tone)}>
              <span
                className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  recognition.state === "listening"
                    ? "bg-teal-300 hs-blink"
                    : recognition.state === "error"
                      ? "bg-rose-400"
                      : "bg-slate-600",
                )}
              />
              {voiceCaption.text}
            </p>
            <p className="hidden font-mono text-[0.62rem] text-slate-700 sm:block">
              gate: pre-scan → provider → post-scan
            </p>
          </div>
        </form>
      </div>

      {/* triage notice for returning users */}
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-600">
        <ShieldX aria-hidden className="h-3.5 w-3.5" />
        {t("triage.emergency")}: {t("triage.emergencyDesc")}
      </p>
    </div>
  );
}
