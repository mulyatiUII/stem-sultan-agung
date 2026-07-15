"use client";

import { motion } from "framer-motion";

const COLORS = ["#FFB3C6", "#A8E0C5", "#A9D7F5", "#FFD9A0", "#C9B8F0"];

/**
 * Celebration confetti. Positions derive from the piece index (not
 * Math.random) so renders are deterministic and hydration-safe.
 */
export function Confetti({ count = 28 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37 + 11) % 100;
        const delay = (i % 7) * 0.12;
        const drift = ((i * 53) % 60) - 30;
        const spin = 180 + ((i * 91) % 360);
        return (
          <motion.span
            key={i}
            className="absolute top-0 block h-3 w-2 rounded-sm"
            style={{ left: `${left}%`, backgroundColor: COLORS[i % COLORS.length] }}
            initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
            animate={{ y: 560, x: drift, rotate: spin, opacity: [1, 1, 0.8, 0] }}
            transition={{ duration: 2.6, delay, ease: "easeIn" }}
          />
        );
      })}
    </div>
  );
}
