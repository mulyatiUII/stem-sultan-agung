"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LiteracyCategory } from "@/types/domain";
import type { StemAspect } from "@/types/learning";
import { WORLDS } from "@/utils/constants";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useSpeech } from "@/hooks/useSpeech";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { Robo } from "@/components/ui/Robo";
import { StemBadges } from "@/components/features/learning/StemBadges";
import { cn } from "@/utils/cn";

export interface WorldMapItem {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  stem?: StemAspect[];
}

type NodeState = "done" | "current" | "locked";

interface WorldMapProps {
  category: LiteracyCategory;
  items: WorldMapItem[];
}

/**
 * The winding activity path inside a world — learning features first,
 * quizzes last. Activities unlock in order; the pulsing node is "your turn".
 */
export function WorldMap({ category, items }: WorldMapProps) {
  const world = WORLDS[category];
  const { progress, isLoaded } = useChildProfile();
  const { speak } = useSpeech();

  const states: NodeState[] = items.map((item, i) => {
    if (progress[item.slug]) return "done";
    const allBeforeDone = items.slice(0, i).every((it) => progress[it.slug]);
    return allBeforeDone ? "current" : "locked";
  });

  const currentIndex = states.indexOf("current");
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* the path */}
        <ol className="flex flex-1 flex-col gap-2">
          {items.map((item, i) => {
            const state = isLoaded ? states[i] : "locked";
            const entry = progress[item.slug];
            const offset = i % 2 === 0 ? "sm:ml-0" : "sm:ml-24";

            return (
              <motion.li
                key={item.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn("flex flex-col", offset)}
              >
                {i > 0 && <span aria-hidden className="ml-10 h-5 w-1 rounded border-l-4 border-dotted border-ink/15" />}

                {state === "locked" ? (
                  <div className="flex items-center gap-4 opacity-50" aria-label={`${item.title} — terkunci`}>
                    <span className="grid h-18 w-18 min-h-16 min-w-16 place-items-center rounded-full bg-ink/5 text-3xl grayscale">
                      {item.emoji}
                    </span>
                    <div>
                      <p className="font-bold text-inksoft">🔒 {item.title}</p>
                      <p className="text-xs text-inksoft">Selesaikan petualangan sebelumnya dulu ya</p>
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} onMouseEnter={() => speak(item.title)} className="group flex items-center gap-4">
                    <motion.span
                      animate={state === "current" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className={cn(
                        "grid h-18 w-18 min-h-16 min-w-16 place-items-center rounded-full text-3xl shadow-lg transition-transform group-hover:scale-110",
                        state === "current" ? world.bg : world.soft
                      )}
                    >
                      {item.emoji}
                    </motion.span>
                    <div>
                      <p className={cn("flex items-center gap-2 text-lg font-extrabold", world.text)}>
                        {state === "current" && "▶️ "}
                        {item.title}
                        {item.stem && <StemBadges aspects={item.stem} />}
                      </p>
                      {entry ? (
                        <StarRating stars={entry.stars} size="sm" />
                      ) : (
                        <p className="text-xs font-semibold text-inksoft">{item.subtitle}</p>
                      )}
                    </div>
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ol>

        {/* mascot side panel */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 p-6 text-center sm:sticky sm:top-20 sm:w-56"
        >
          <Robo size={110} />
          <p className="text-sm font-semibold text-ink">
            {currentItem ? `Ayo main "${currentItem.title}"!` : "Semua petualangan selesai! Kamu hebat! 🎉"}
          </p>
        </motion.aside>
      </div>

      {currentItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link href={currentItem.href}>
            <Button className="px-12 text-xl">▶️ MAIN — {currentItem.title}</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
