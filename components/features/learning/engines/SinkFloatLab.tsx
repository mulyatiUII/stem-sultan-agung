"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProgressLights } from "@/components/ui/ProgressLights";
import { Robo } from "@/components/ui/Robo";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";
import { GameIntro, GameFinish } from "./shared";

export interface LabObject {
  emoji: string;
  name: string;
  floats: boolean;
  fact: string;
}

interface SinkFloatLabProps {
  slug: string;
  title: string;
  instruction: string;
  objects: LabObject[];
}

/**
 * The scientific method, child-sized: PREDICT (tebak) → TEST (celupkan) →
 * OBSERVE (lihat hasilnya) → COUNT correct predictions. A wrong prediction is
 * a discovery, not a mistake — the fact line explains what happened.
 */
export function SinkFloatLab({ slug, title, instruction, objects }: SinkFloatLabProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { speak } = useSpeech();

  const object = objects[step];

  useEffect(() => {
    if (phase === "play" && object && prediction === null) {
      speak(`${object.name}. Kira-kira tenggelam atau terapung ya?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step]);

  if (phase === "intro") return <GameIntro title={title} instruction={instruction} onStart={() => setPhase("play")} />;
  if (phase === "done") return <GameFinish slug={slug} correct={correctCount} total={objects.length} />;
  if (!object) return null;

  const predictedRight = prediction === object.floats;

  function predict(floats: boolean) {
    if (prediction !== null) return;
    setPrediction(floats);
    speak("Ayo kita buktikan!");
    setTimeout(() => {
      setRevealed(true);
      const right = floats === object.floats;
      if (right) setCorrectCount((c) => c + 1);
      speak(
        `${object.name} ${object.floats ? "terapung" : "tenggelam"}! ${right ? "Tebakanmu benar, ilmuwan hebat!" : "Wah, ternyata begitu! Sekarang kamu tahu!"}`
      );
    }, 900);
  }

  function next() {
    if (step + 1 < objects.length) {
      setStep((s) => s + 1);
      setPrediction(null);
      setRevealed(false);
    } else {
      setPhase("done");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <ProgressLights total={objects.length} current={step} />
        <p className="text-sm font-bold text-inksoft" style={{ fontVariantNumeric: "tabular-nums" }}>
          Tebakan benar: {correctCount}
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
        {/* water tank */}
        <div className="relative h-72 overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/5">
          {/* air */}
          <div className="absolute inset-x-0 top-0 h-24" />
          {/* water */}
          <div className="absolute inset-x-0 bottom-0 h-48 rounded-b-3xl bg-gradient-to-b from-skyblue/60 to-skyblue">
            <motion.div
              aria-hidden
              className="absolute -top-2 h-3 w-full bg-skyblue/40"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* the object */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${revealed}`}
              className="absolute left-1/2 -translate-x-1/2 text-6xl"
              initial={{ top: 8 }}
              animate={{ top: revealed ? (object.floats ? 76 : 210) : 8 }}
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
            >
              {object.emoji}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="flex flex-col items-center justify-center gap-3 sm:w-56">
          <p className="text-center text-xl font-extrabold text-ink" style={{ textWrap: "balance" }}>
            {object.emoji} {object.name}
          </p>

          {prediction === null && (
            <>
              <p className="text-center text-sm text-inksoft">Tebak dulu, baru kita buktikan!</p>
              <Button variant="secondary" className="w-full" onClick={() => predict(true)}>
                ⬆️ Terapung
              </Button>
              <Button className="w-full" onClick={() => predict(false)}>
                ⬇️ Tenggelam
              </Button>
            </>
          )}

          {revealed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <p className={cn("text-lg font-extrabold", predictedRight ? "text-mintdeep" : "text-skydeep")}>
                {predictedRight ? "✅ Tebakanmu benar!" : "💡 Penemuan baru!"}
              </p>
              <p className="mt-1 text-xs text-inksoft">{object.fact}</p>
              <Button className="mt-3 w-full" onClick={next}>
                {step + 1 < objects.length ? "➡️ Benda berikutnya" : "✨ Selesai"}
              </Button>
            </motion.div>
          )}

          {prediction !== null && !revealed && (
            <div className="flex items-center gap-2">
              <Robo size={60} />
              <p className="text-sm font-bold text-inksoft">Mencelupkan…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
