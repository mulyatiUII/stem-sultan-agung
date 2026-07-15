"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * "Lampu" progress trail — children can't read "3/5", but they can see
 * which lights are on. green = answered, pulsing blue = current, grey = todo.
 */
export function ProgressLights({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Soal ${current + 1} dari ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <motion.span
            key={i}
            className={cn(
              "h-4 w-4 rounded-full",
              state === "done" && "bg-mint",
              state === "active" && "bg-skyblue",
              state === "todo" && "bg-ink/10"
            )}
            animate={state === "active" ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={state === "active" ? { duration: 1.2, repeat: Infinity } : undefined}
          />
        );
      })}
    </div>
  );
}
