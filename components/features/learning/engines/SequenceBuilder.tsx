"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressLights } from "@/components/ui/ProgressLights";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";
import { GameIntro, GameFinish } from "./shared";

export interface SequenceRound {
  /** Emoji/visual hint of the finished thing (e.g. 👩 for IBU, 🌸 for growth). */
  hint: string;
  hintLabel: string;
  /** Tiles in their correct order. */
  tiles: string[];
  speak: string;
}

interface SequenceBuilderProps {
  slug: string;
  title: string;
  instruction: string;
  rounds: SequenceRound[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Montessori-style self-correcting assembly: tap tiles from the pool in
 * order; only the correct next tile snaps into place, a wrong tap wiggles.
 * Used for menyusun kata and ordering nature sequences (engineering: build
 * the whole from its parts).
 */
export function SequenceBuilder({ slug, title, instruction, rounds }: SequenceBuilderProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [step, setStep] = useState(0);
  const [placedCount, setPlacedCount] = useState(0);
  const [pool, setPool] = useState<{ tile: string; poolIndex: number; used: boolean }[]>([]);
  const [wigglingIndex, setWigglingIndex] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const { speak } = useSpeech();

  const round = rounds[step];

  // Shuffle after mount / per round — client-only, hydration-safe.
  useEffect(() => {
    if (!round) return;
    setPool(shuffle(round.tiles.map((tile, poolIndex) => ({ tile, poolIndex, used: false }))));
    setPlacedCount(0);
  }, [round]);

  useEffect(() => {
    if (phase === "play" && round) speak(round.speak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step]);

  if (phase === "intro") return <GameIntro title={title} instruction={instruction} onStart={() => setPhase("play")} />;
  if (phase === "done") {
    // Fewer mistakes -> more stars; floor at 1 because finishing is always celebrated.
    const correct = Math.max(rounds.length - mistakes, 1);
    return <GameFinish slug={slug} correct={correct} total={rounds.length} />;
  }
  if (!round) return null;

  const isRoundComplete = placedCount === round.tiles.length;

  function tapTile(index: number) {
    if (isRoundComplete) return;
    const entry = pool[index];
    if (entry.used) return;

    if (entry.tile === round.tiles[placedCount]) {
      setPool((prev) => prev.map((p, i) => (i === index ? { ...p, used: true } : p)));
      const nextCount = placedCount + 1;
      setPlacedCount(nextCount);
      speak(entry.tile);

      if (nextCount === round.tiles.length) {
        speak(`${round.hintLabel}! Hebat!`);
        setTimeout(() => {
          if (step + 1 < rounds.length) setStep((s) => s + 1);
          else setPhase("done");
        }, 1500);
      }
    } else {
      setMistakes((m) => m + 1);
      setWigglingIndex(index);
      setTimeout(() => setWigglingIndex(null), 500);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <ProgressLights total={rounds.length} current={step} />
        <SpeakButton text={round.speak} label="dengarkan" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          className="mt-8 text-center"
        >
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-ink/5">
            <p className="text-6xl">{round.hint}</p>
            <p className="mt-1 text-sm font-bold text-inksoft">{round.hintLabel}</p>

            {/* assembly slots */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {round.tiles.map((tile, i) => (
                <motion.span
                  key={i}
                  animate={i === placedCount && !isRoundComplete ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className={cn(
                    "grid h-16 w-16 place-items-center rounded-2xl text-3xl font-extrabold",
                    i < placedCount ? "bg-mint text-mintdeep" : "border-4 border-dashed border-ink/15 text-transparent"
                  )}
                >
                  {i < placedCount ? tile : "?"}
                </motion.span>
              ))}
            </div>
            {isRoundComplete && (
              <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="mt-4 text-xl font-extrabold text-mintdeep">
                ✅ {round.hintLabel}! 🎉
              </motion.p>
            )}
          </div>

          {/* tile pool */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {pool.map((entry, i) => (
              <motion.button
                key={`${step}-${i}`}
                type="button"
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.88 }}
                animate={wigglingIndex === i ? { x: [0, -8, 8, -6, 6, 0] } : { opacity: entry.used ? 0.15 : 1 }}
                onClick={() => tapTile(i)}
                disabled={entry.used}
                className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-4xl font-extrabold text-ink shadow-lg shadow-ink/5"
              >
                {entry.tile}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
