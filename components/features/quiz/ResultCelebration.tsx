"use client";

import { motion } from "framer-motion";
import type { ActivityResultDTO } from "@/types/dto";
import { StarRating } from "@/components/ui/StarRating";
import { Confetti } from "@/components/ui/Confetti";
import { Button } from "@/components/ui/Button";
import { Robo } from "@/components/ui/Robo";

/**
 * End-of-quiz celebration. Every finish is celebrated — 1 star is praised,
 * never framed as failure (design rule: "gagal itu aman").
 */
export function ResultCelebration({ result }: { result: ActivityResultDTO }) {
  const message =
    result.stars >= 3 ? "Luar biasa!" : result.stars === 2 ? "Kerja bagus!" : "Hebat, kamu menyelesaikannya!";

  return (
    <div className="relative flex flex-col items-center gap-6 py-10 text-center">
      {result.stars > 0 && <Confetti count={result.stars * 12} />}

      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <Robo size={130} />
      </motion.div>

      <motion.h2
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold text-ink"
      >
        {message} 🎉
      </motion.h2>

      <StarRating stars={result.stars} />

      <p className="text-lg text-inksoft">
        Benar {result.correct} dari {result.total} soal
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => window.location.reload()}>🔄 Main lagi</Button>
        <Button variant="secondary" onClick={() => window.history.back()}>
          ➡️ Petualangan berikutnya
        </Button>
      </div>
    </div>
  );
}
