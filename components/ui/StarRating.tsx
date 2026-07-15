"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function StarRating({ stars, max = 3, size = "lg" }: { stars: number; max?: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-1.5" role="img" aria-label={`${stars} dari ${max} bintang`}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.18, type: "spring", stiffness: 260, damping: 14 }}
          className={cn(size === "lg" ? "text-5xl" : "text-xl", i < stars ? "text-sunny" : "text-ink/10")}
          style={i < stars ? { filter: "drop-shadow(0 2px 4px rgba(255,217,160,.8))" } : undefined}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}
