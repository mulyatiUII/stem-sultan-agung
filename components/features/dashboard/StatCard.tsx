"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warning";
  index?: number;
}

export function StatCard({ label, value, hint, tone = "default", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "rounded-2xl p-5 shadow-md shadow-ink/5",
        tone === "warning" ? "bg-sunsoft" : "bg-white"
      )}
    >
      <p className="text-2xl font-extrabold text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-inksoft">{label}</p>
      {hint && <p className={cn("mt-2 text-xs", tone === "warning" ? "text-sundeep" : "text-inksoft")}>{hint}</p>}
    </motion.div>
  );
}
