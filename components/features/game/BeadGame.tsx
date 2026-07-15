"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { Robo } from "@/components/ui/Robo";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";

const BEADS = [
  { id: "red", emoji: "🔴", name: "merah" },
  { id: "blue", emoji: "🔵", name: "biru" },
  { id: "yellow", emoji: "🟡", name: "kuning" },
  { id: "green", emoji: "🟢", name: "hijau" },
];

const MAX_BEADS = 8;
const INSTRUCTION = "Ayo buat gelang! Pilih manik-manik, lalu susun pola warna yang berulang.";

/** Returns the repeating pattern length (2–4) if the bracelet repeats, else null. */
function detectPattern(beads: string[]): number | null {
  if (beads.length < 4) return null;
  for (const period of [2, 3, 4]) {
    if (beads.length < period * 2) continue;
    if (beads.every((b, i) => b === beads[i % period])) return period;
  }
  return null;
}

/**
 * Free-play bracelet builder (Halaman Game). Unlike the quiz there is no
 * wrong answer — Robo comments on whatever the child builds.
 */
export function BeadGame() {
  const [beads, setBeads] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const { speak } = useSpeech();

  const pattern = detectPattern(beads);

  function addBead(id: string, name: string) {
    if (finished || beads.length >= MAX_BEADS) return;
    setBeads((prev) => [...prev, id]);
    speak(name);
  }

  function removeBead(index: number) {
    if (finished) return;
    setBeads((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setBeads([]);
    setFinished(false);
  }

  function handleFinish() {
    setFinished(true);
    speak(
      pattern
        ? `Wah, kamu membuat pola ${pattern} warna yang berulang! Gelangmu cantik sekali!`
        : "Gelang warna-warni yang indah! Coba juga membuat pola yang berulang ya!"
    );
  }

  const roboComment = finished
    ? pattern
      ? `Pola ${pattern} warna! Kamu hebat! 🎉`
      : "Gelang warna-warni! Indah! 🌈"
    : beads.length === 0
      ? "Pilih manik pertamamu!"
      : pattern
        ? "Aku lihat polanya! Lanjutkan!"
        : "Manik apa selanjutnya ya?";

  return (
    <div className="relative mx-auto max-w-3xl">
      {finished && pattern && <Confetti />}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-ink">Membuat Gelang Manik-Manik</h1>
        <SpeakButton text={INSTRUCTION} label="dengarkan" />
      </div>
      <p className="mt-1 text-inksoft">Susun manik-manik dan buat pola warna yang berulang!</p>

      {/* bracelet string */}
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl shadow-ink/5">
        <div className="flex min-h-24 flex-wrap items-center justify-center gap-3">
          {Array.from({ length: MAX_BEADS }).map((_, i) => {
            const bead = BEADS.find((b) => b.id === beads[i]);
            return bead ? (
              <motion.button
                key={`${i}-${bead.id}`}
                type="button"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => removeBead(i)}
                className="text-5xl"
                aria-label={`Lepas manik ${bead.name}`}
              >
                {bead.emoji}
              </motion.button>
            ) : (
              <span key={`empty-${i}`} aria-hidden className="h-12 w-12 rounded-full border-4 border-dashed border-ink/15" />
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs font-semibold text-inksoft">
          Sentuh manik di gelang untuk melepasnya
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        {/* bead basket */}
        <div className="flex-1 rounded-3xl bg-blushsoft p-6">
          <p className="text-center text-sm font-bold text-blushdeep">Keranjang Manik</p>
          <div className="mt-3 flex justify-center gap-4">
            {BEADS.map((bead) => (
              <motion.button
                key={bead.id}
                type="button"
                whileHover={{ scale: 1.2, y: -6 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => addBead(bead.id, bead.name)}
                disabled={finished || beads.length >= MAX_BEADS}
                className="text-6xl disabled:opacity-30"
                aria-label={`Tambah manik ${bead.name}`}
              >
                {bead.emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Robo commentary */}
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-md sm:w-64">
          <Robo size={80} />
          <AnimatePresence mode="wait">
            <motion.p
              key={roboComment}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-bold text-ink"
            >
              {roboComment}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button variant="ghost" onClick={reset}>
          🔄 Ulang
        </Button>
        {!finished && (
          <Button onClick={handleFinish} disabled={beads.length < 4} className={cn(beads.length < 4 && "opacity-40")}>
            ✨ SELESAI — pakai gelangku!
          </Button>
        )}
        {finished && <Button onClick={reset}>🎨 Buat gelang baru</Button>}
      </div>
    </div>
  );
}
