"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressLights } from "@/components/ui/ProgressLights";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { OptionButton } from "@/components/ui/OptionButton";
import { useSpeech } from "@/hooks/useSpeech";
import { GameIntro, GameFinish } from "./shared";

export interface PickRound {
  /** Written prompt (short). */
  prompt: string;
  /** Big visual above the prompt, e.g. "🍎🍎  +  🍎" or "A B ? D". */
  visual?: string;
  /** What to read aloud (defaults to prompt). */
  speak?: string;
  options: { label: string; correct?: boolean }[];
}

interface PickAnswerGameProps {
  slug: string;
  title: string;
  instruction: string;
  /** Called on the client after mount — free to shuffle with Math.random. */
  makeRounds: () => PickRound[];
}

/**
 * Generic "pick the right answer" engine for generated rounds
 * (menghitung, penjumlahan, puzzle huruf/angka, dengar & tebak, ...).
 * Same gentle rules as the quiz: one retry, wrong answers never punished.
 */
export function PickAnswerGame({ slug, title, instruction, makeRounds }: PickAnswerGameProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [rounds, setRounds] = useState<PickRound[]>([]);
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "retry" | "moveon">("idle");
  const [hasRetried, setHasRetried] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const { speak } = useSpeech();

  // Rounds are generated after mount so shuffling never causes hydration drift.
  useEffect(() => {
    setRounds(makeRounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const round = rounds[step];

  useEffect(() => {
    if (phase === "play" && round) speak(round.speak ?? round.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step, rounds.length]);

  if (phase === "intro") return <GameIntro title={title} instruction={instruction} onStart={() => setPhase("play")} />;
  if (phase === "done") return <GameFinish slug={slug} correct={correctCount} total={rounds.length} />;
  if (!round) return null;

  function advance() {
    if (step + 1 < rounds.length) {
      setStep((s) => s + 1);
      setFeedback("idle");
      setPicked(null);
      setHasRetried(false);
    } else {
      setPhase("done");
    }
  }

  function choose(i: number) {
    if (feedback === "correct" || feedback === "moveon") return;
    setPicked(i);

    if (round.options[i].correct) {
      setCorrectCount((c) => c + 1);
      setFeedback("correct");
      speak("Betul! Hebat!");
      setTimeout(advance, 1100);
    } else if (!hasRetried) {
      setFeedback("retry");
      setHasRetried(true);
      speak("Hmm, coba lagi yuk!");
    } else {
      setFeedback("moveon");
      speak("Tidak apa-apa, lanjut ya!");
      setTimeout(advance, 1300);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <ProgressLights total={rounds.length} current={step} />
        <SpeakButton text={round.speak ?? round.prompt} label="dengarkan" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <motion.div
            animate={feedback === "retry" ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-ink/5"
          >
            {round.visual && <p className="text-5xl leading-relaxed tracking-wider">{round.visual}</p>}
            <h2 className="mt-3 text-2xl font-extrabold text-ink" style={{ textWrap: "balance" }}>
              {round.prompt}
            </h2>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {round.options.map((option, i) => (
              <OptionButton
                key={`${step}-${i}`}
                label={option.label}
                picked={picked === i}
                dimmed={feedback === "correct" && picked !== i}
                onSelect={() => choose(i)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 min-h-10 text-center" aria-live="polite">
        {feedback === "correct" && <p className="text-xl font-extrabold text-mintdeep">✅ Betul! 🎉</p>}
        {feedback === "retry" && <p className="text-lg font-bold text-sundeep">💛 Coba lagi yuk!</p>}
        {feedback === "moveon" && <p className="text-lg font-bold text-skydeep">💙 Tidak apa-apa, lanjut!</p>}
      </div>
    </div>
  );
}
