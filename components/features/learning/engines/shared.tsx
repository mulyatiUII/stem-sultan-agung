"use client";

import { motion } from "framer-motion";
import { Robo } from "@/components/ui/Robo";
import { Button } from "@/components/ui/Button";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { ResultCelebration } from "@/components/features/quiz/ResultCelebration";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useEffect, useRef } from "react";

/** Shared intro screen: Robo + spoken instruction + big start button. */
export function GameIntro({
  title,
  instruction,
  onStart,
}: {
  title: string;
  instruction: string;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      <Robo size={130} />
      <h2 className="text-3xl font-extrabold text-ink" style={{ textWrap: "balance" }}>
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <p className="max-w-[46ch] text-inksoft">{instruction}</p>
        <SpeakButton text={instruction} />
      </div>
      <Button onClick={onStart} className="px-12 text-xl">
        ▶️ Mulai!
      </Button>
    </motion.div>
  );
}

export function starsFromRatio(correct: number, total: number): number {
  if (total === 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio > 0) return 1;
  return 0;
}

/**
 * Shared finish screen: records progress (once) into the local store,
 * then reuses the quiz celebration so every activity ends the same joyful way.
 */
export function GameFinish({ slug, correct, total }: { slug: string; correct: number; total: number }) {
  const { recordResult } = useChildProfile();
  const recorded = useRef(false);
  const stars = starsFromRatio(correct, total);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordResult(slug, { stars, correct, total, completedAt: new Date().toISOString() });
  }, [slug, stars, correct, total, recordResult]);

  return (
    <ResultCelebration
      result={{ id: `local-${slug}`, stars, correct, total, completedAt: new Date().toISOString() }}
    />
  );
}
