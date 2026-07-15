"use client";

import { motion } from "framer-motion";
import type { ProgressMap } from "@/hooks/useChildProfile";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/** Stars earned per day over the last 14 days, from real completedAt stamps. */
export function WeeklyChart({ progress }: { progress: ProgressMap }) {
  const days: { label: string; stars: number }[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = day.toDateString();
    const stars = Object.values(progress)
      .filter((p) => new Date(p.completedAt).toDateString() === key)
      .reduce((sum, p) => sum + p.stars, 0);
    days.push({ label: DAY_LABELS[day.getDay()], stars });
  }

  const max = Math.max(3, ...days.map((d) => d.stars));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md shadow-ink/5">
      <p className="text-sm font-bold text-ink">Bintang 14 hari terakhir</p>
      <div className="mt-4 flex h-28 items-end gap-1.5">
        {days.map((day, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-md bg-sunny"
              initial={{ height: 0 }}
              animate={{ height: `${(day.stars / max) * 100}%` }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              style={{ minHeight: day.stars > 0 ? 6 : 2, opacity: day.stars > 0 ? 1 : 0.25 }}
              title={`${day.stars} bintang`}
            />
            <span className="text-[9px] font-semibold text-inksoft">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
