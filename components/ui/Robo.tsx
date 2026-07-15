"use client";

import { motion } from "framer-motion";

/**
 * "Robo" — the mascot that accompanies children on every page.
 * Pure SVG so it needs no image assets; floats gently while idle.
 */
export function Robo({ size = 140, className }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      role="img"
      aria-label="Robo, maskot Petualang STEM"
    >
      {/* antenna */}
      <line x1="60" y1="18" x2="60" y2="8" stroke="#4A4458" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="60"
        cy="7"
        r="5"
        fill="#FFB3C6"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {/* head */}
      <rect x="28" y="18" width="64" height="48" rx="16" fill="#A9D7F5" stroke="#4A4458" strokeWidth="3" />
      {/* eyes */}
      <motion.g animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }} style={{ transformOrigin: "60px 40px" }}>
        <circle cx="46" cy="40" r="5.5" fill="#4A4458" />
        <circle cx="74" cy="40" r="5.5" fill="#4A4458" />
      </motion.g>
      {/* cheeks + smile */}
      <circle cx="38" cy="50" r="4" fill="#FFB3C6" opacity="0.8" />
      <circle cx="82" cy="50" r="4" fill="#FFB3C6" opacity="0.8" />
      <path d="M50 52 Q60 60 70 52" stroke="#4A4458" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="36" y="70" width="48" height="34" rx="12" fill="#FFFDF8" stroke="#4A4458" strokeWidth="3" />
      <path
        d="M60 82 c-3-4 -9-2 -9 2 c0 4 6 7 9 9 c3-2 9-5 9-9 c0-4 -6-6 -9-2z"
        fill="#FFB3C6"
        stroke="#4A4458"
        strokeWidth="2"
      />
      {/* arms — right one waves */}
      <line x1="36" y1="80" x2="24" y2="90" stroke="#4A4458" strokeWidth="4" strokeLinecap="round" />
      <motion.line
        x1="84"
        y1="80"
        x2="98"
        y2="70"
        stroke="#4A4458"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ rotate: [0, 18, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "84px 80px" }}
      />
      {/* feet */}
      <circle cx="48" cy="108" r="6" fill="#A9D7F5" stroke="#4A4458" strokeWidth="3" />
      <circle cx="72" cy="108" r="6" fill="#A9D7F5" stroke="#4A4458" strokeWidth="3" />
    </motion.svg>
  );
}
