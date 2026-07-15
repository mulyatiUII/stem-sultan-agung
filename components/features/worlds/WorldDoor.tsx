"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ModuleSummaryDTO } from "@/types/dto";
import { WORLDS, GRADE_SLUGS, CATEGORY_SLUGS } from "@/utils/constants";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";

/** One of the three "world doors" on the grade menu (Rumah Kata / Kota Angka / Kebun Sains). */
export function WorldDoor({ module, index }: { module: ModuleSummaryDTO; index: number }) {
  const world = WORLDS[module.category];
  const href = `/${GRADE_SLUGS[module.grade]}/${CATEGORY_SLUGS[module.category]}`;
  const { speak } = useSpeech();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 160, damping: 18 }}
    >
      <Link href={href} onMouseEnter={() => speak(world.name)}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -1.5, y: -6 }}
          whileTap={{ scale: 0.97 }}
          className={cn("flex flex-col items-center gap-3 rounded-[2rem] p-10 text-center shadow-xl", world.bg)}
        >
          <motion.span
            className="text-7xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.4 }}
          >
            {world.emoji}
          </motion.span>
          <h3 className={cn("text-2xl font-extrabold", world.text)}>{world.name}</h3>
          <p className={cn("text-sm font-semibold opacity-80", world.text)}>{world.tagline}</p>
          <span className="mt-2 rounded-full bg-white/70 px-4 py-1 text-xs font-bold text-ink">
            {module.activityCount} petualangan
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
