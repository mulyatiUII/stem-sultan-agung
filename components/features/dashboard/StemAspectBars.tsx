"use client";

import { motion } from "framer-motion";
import type { ProgressMap } from "@/hooks/useChildProfile";
import type { StemAspect } from "@/types/learning";
import { STEM_LABELS } from "@/types/learning";
import { LEARNING_FEATURES, QUIZ_SLUG_CATEGORY } from "@/components/features/learning/meta";
import type { LiteracyCategory } from "@/types/domain";
import { cn } from "@/utils/cn";

const BAR_STYLE: Record<StemAspect, string> = {
  S: "bg-mint",
  T: "bg-skyblue",
  E: "bg-sunny",
  M: "bg-lilac",
};

/** Quizzes carry the default aspect of their world. */
const QUIZ_DEFAULT_ASPECTS: Record<LiteracyCategory, StemAspect[]> = {
  BAHASA: ["T"],
  NUMERIK: ["M"],
  SAINS: ["S"],
};

/** How many completed activities touched each STEM aspect. */
export function StemAspectBars({ progress }: { progress: ProgressMap }) {
  const counts: Record<StemAspect, number> = { S: 0, T: 0, E: 0, M: 0 };
  let max = 1;

  for (const feature of LEARNING_FEATURES) {
    if (!progress[feature.slug]) continue;
    for (const aspect of feature.stem) counts[aspect] += 1;
  }
  for (const [slug, category] of Object.entries(QUIZ_SLUG_CATEGORY)) {
    if (!progress[slug]) continue;
    for (const aspect of QUIZ_DEFAULT_ASPECTS[category]) counts[aspect] += 1;
  }
  max = Math.max(max, ...Object.values(counts));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md shadow-ink/5">
      <p className="text-sm font-bold text-ink">Aspek STEM yang terlatih</p>
      <div className="mt-4 space-y-3">
        {(Object.keys(counts) as StemAspect[]).map((aspect, i) => (
          <div key={aspect} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-bold text-inksoft">{STEM_LABELS[aspect]}</span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper">
              <motion.div
                className={cn("h-full rounded-full", BAR_STYLE[aspect])}
                initial={{ width: 0 }}
                animate={{ width: `${(counts[aspect] / max) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              />
            </div>
            <span className="w-6 text-right text-xs font-bold text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
              {counts[aspect]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
