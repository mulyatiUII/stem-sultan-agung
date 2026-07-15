"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface OptionButtonProps {
  label: string;
  imageUrl?: string | null;
  picked: boolean;
  dimmed?: boolean;
  onSelect: () => void;
}

/**
 * Palm-sized answer card shared by the quiz and every learning game —
 * min 96px tall, emoji/label rendered huge, bouncy on hover/tap.
 */
export function OptionButton({ label, imageUrl, picked, dimmed, onSelect }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.93 }}
      animate={{ opacity: dimmed ? 0.35 : 1 }}
      onClick={onSelect}
      className={cn(
        "flex min-h-24 w-full items-center justify-center rounded-3xl border-4 p-4 text-3xl font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-skyblue/60",
        picked ? "border-blush bg-blushsoft text-blushdeep" : "border-transparent bg-white text-ink shadow-lg shadow-ink/5"
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label} className="h-20 w-20 object-contain" />
      ) : (
        label
      )}
    </motion.button>
  );
}
