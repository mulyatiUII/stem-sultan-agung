"use client";

import { motion } from "framer-motion";
import type { LiteracyCategory } from "@/types/domain";
import type { ProgressMap } from "@/hooks/useChildProfile";
import { slugsForCategory } from "@/utils/gamification";
import { WORLDS } from "@/utils/constants";
import { cn } from "@/utils/cn";

/** Per-world completion bars: activities done + stars collected. */
export function WorldProgressBars({ progress }: { progress: ProgressMap }) {
  const categories: LiteracyCategory[] = ["BAHASA", "NUMERIK", "SAINS"];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {categories.map((category, i) => {
        const world = WORLDS[category];
        const slugs = slugsForCategory(category);
        const done = slugs.filter((s) => progress[s]).length;
        const stars = slugs.reduce((sum, s) => sum + (progress[s]?.stars ?? 0), 0);
        const pct = slugs.length === 0 ? 0 : Math.round((done / slugs.length) * 100);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("rounded-2xl p-5", world.soft)}
          >
            <p className={cn("font-extrabold", world.text)}>
              {world.emoji} {world.name}
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/70">
              <motion.div
                className={cn("h-full rounded-full", world.bg)}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-inksoft" style={{ fontVariantNumeric: "tabular-nums" }}>
              {done}/{slugs.length} aktivitas · ⭐ {stars}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
