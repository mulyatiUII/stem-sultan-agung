"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/utils/cn";
import { GameIntro, GameFinish } from "./shared";

export interface ExplorerItem {
  key: string;
  /** Big symbol on the grid tile (letter, number, emoji). */
  display: string;
  name: string;
  /** Optional extra line in the detail panel. */
  detail?: string;
  /** Optional big visual in the detail panel (e.g. row of counting emojis). */
  visual?: string;
  speak: string;
}

interface ExplorerBoardProps {
  slug: string;
  title: string;
  instruction: string;
  items: ExplorerItem[];
  /** Grid tile size hint — "sm" fits 26 letters, "lg" fits 8 planets. */
  tile?: "sm" | "lg";
}

/**
 * Tap-to-discover board (Huruf A–Z, Angka, Hewan, Tubuh, Planet...).
 * Every explored tile gets a check; exploring everything earns full stars.
 */
export function ExplorerBoard({ slug, title, instruction, items, tile = "lg" }: ExplorerBoardProps) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const { speak } = useSpeech();

  if (phase === "intro") return <GameIntro title={title} instruction={instruction} onStart={() => setPhase("play")} />;
  if (phase === "done") return <GameFinish slug={slug} correct={explored.size} total={items.length} />;

  const selected = items.find((i) => i.key === selectedKey);

  function open(item: ExplorerItem) {
    setSelectedKey(item.key);
    setExplored((prev) => new Set(prev).add(item.key));
    speak(item.speak);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-inksoft">
          Sudah dijelajahi: {explored.size} / {items.length}
        </p>
        <Button
          variant="ghost"
          className={cn("min-h-0 px-5 py-2 text-sm", explored.size === 0 && "opacity-40")}
          disabled={explored.size === 0}
          onClick={() => setPhase("done")}
        >
          ✨ Selesai
        </Button>
      </div>

      {/* detail panel */}
      <div className="mt-4 min-h-40 rounded-3xl bg-white p-6 text-center shadow-xl shadow-ink/5">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.key}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <p className="text-6xl">{selected.visual ?? selected.display}</p>
              <p className="mt-2 text-2xl font-extrabold text-ink">{selected.name}</p>
              {selected.detail && <p className="mt-1 text-sm text-inksoft">{selected.detail}</p>}
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-inksoft">
              👇 Sentuh salah satu untuk memulai!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* tile grid */}
      <div className={cn("mt-6 grid gap-2", tile === "sm" ? "grid-cols-6 sm:grid-cols-9" : "grid-cols-3 sm:grid-cols-4")}>
        {items.map((item, i) => {
          const isExplored = explored.has(item.key);
          return (
            <motion.button
              key={item.key}
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => open(item)}
              className={cn(
                "relative grid place-items-center rounded-2xl p-3 font-extrabold shadow-md transition-colors",
                tile === "sm" ? "min-h-12 text-xl" : "min-h-20 text-4xl",
                selectedKey === item.key ? "bg-blush text-white" : isExplored ? "bg-mintsoft text-ink" : "bg-white text-ink"
              )}
              aria-label={item.name}
            >
              {item.display}
              {isExplored && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-mint text-[10px]">
                  ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
