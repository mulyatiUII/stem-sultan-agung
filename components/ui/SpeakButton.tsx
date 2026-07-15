"use client";

import { motion } from "framer-motion";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";

/** The 🔊 button present on every child-facing screen (FR-4: audio instructions). */
export function SpeakButton({ text, className, label }: { text: string; className?: string; label?: string }) {
  const { speak } = useSpeech();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => speak(text)}
      className={cn(
        "flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-md hover:bg-blushsoft",
        className
      )}
      aria-label={`Dengarkan: ${text}`}
    >
      <span className="text-lg">🔊</span>
      {label && <span>{label}</span>}
    </motion.button>
  );
}
