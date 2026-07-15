"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/apiClient";
import { useChildProfile } from "@/hooks/useChildProfile";
import { cn } from "@/utils/cn";

interface Entry {
  nickname: string;
  totalStars: number;
  plays: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

/**
 * Simple leaderboard: server-side quiz results merged with this device's
 * child (whose learning-game stars live locally), highlighted as "kamu".
 */
export function LeaderboardTable() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { profile, totalStars, stats } = useChildProfile();

  useEffect(() => {
    apiGet<Entry[]>("/api/leaderboard")
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  const childName = profile.name.trim();
  const merged = [...entries.filter((e) => e.nickname !== childName)];
  if (childName) {
    merged.push({ nickname: childName, totalStars, plays: stats.plays });
  }
  merged.sort((a, b) => b.totalStars - a.totalStars);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md shadow-ink/5">
      <p className="text-sm font-bold text-ink">🏆 Papan Bintang</p>
      {!childName && (
        <p className="mt-1 text-xs text-inksoft">Isi nama di halaman Profil supaya kamu ikut tampil!</p>
      )}
      <ol className="mt-3 space-y-1.5">
        {merged.slice(0, 10).map((entry, i) => {
          const isChild = entry.nickname === childName;
          return (
            <motion.li
              key={entry.nickname}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2",
                isChild ? "bg-blushsoft font-extrabold text-blushdeep" : "bg-paper"
              )}
            >
              <span className="w-7 text-center text-sm">{MEDALS[i] ?? i + 1}</span>
              <span className="flex-1 text-sm font-bold">
                {entry.nickname}
                {isChild && " (kamu)"}
              </span>
              <span className="text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                ⭐ {entry.totalStars}
              </span>
            </motion.li>
          );
        })}
        {merged.length === 0 && <p className="py-3 text-center text-xs text-inksoft">Belum ada data.</p>}
      </ol>
    </div>
  );
}
