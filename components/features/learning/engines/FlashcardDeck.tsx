"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProgressLights } from "@/components/ui/ProgressLights";
import { useSpeech } from "@/hooks/useSpeech";
import { GameIntro, GameFinish } from "./shared";

export interface Flashcard {
  front: string;
  back: string;
  speak: string;
}

interface FlashcardDeckProps {
  slug: string;
  title: string;
  instruction: string;
  cards: Flashcard[];
}

/** Flip-card deck: picture on the front, the word on the back, spoken aloud. */
export function FlashcardDeck({ slug, title, instruction, cards }: FlashcardDeckProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const { speak } = useSpeech();

  if (phase === "intro") return <GameIntro title={title} instruction={instruction} onStart={() => setPhase("play")} />;
  if (phase === "done") return <GameFinish slug={slug} correct={seen.size} total={cards.length} />;

  const card = cards[index];

  function flip() {
    const next = !flipped;
    setFlipped(next);
    if (next) {
      setSeen((prev) => new Set(prev).add(index));
      speak(card.speak);
    }
  }

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center">
      <ProgressLights total={cards.length} current={index} />

      <div className="mt-8 [perspective:1200px]">
        <AnimatePresence mode="wait">
          <motion.button
            key={index}
            type="button"
            onClick={flip}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, rotateY: flipped ? 180 : 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="relative h-64 w-56 rounded-3xl shadow-xl [transform-style:preserve-3d]"
            aria-label={flipped ? card.back : "Balik kartu"}
          >
            <span className="absolute inset-0 grid place-items-center rounded-3xl bg-white text-8xl [backface-visibility:hidden]">
              {card.front}
            </span>
            <span className="absolute inset-0 grid place-items-center rounded-3xl bg-mint text-4xl font-extrabold text-mintdeep [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {card.back}
            </span>
          </motion.button>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-sm font-semibold text-inksoft">Sentuh kartu untuk membaliknya!</p>

      <div className="mt-6 flex items-center gap-4">
        <Button variant="ghost" onClick={() => go(-1)} aria-label="Kartu sebelumnya">
          ⬅️
        </Button>
        {seen.size === cards.length ? (
          <Button onClick={() => setPhase("done")}>✨ Selesai!</Button>
        ) : (
          <span className="text-sm font-bold text-inksoft" style={{ fontVariantNumeric: "tabular-nums" }}>
            {seen.size}/{cards.length} kartu
          </span>
        )}
        <Button variant="ghost" onClick={() => go(1)} aria-label="Kartu berikutnya">
          ➡️
        </Button>
      </div>
    </div>
  );
}
