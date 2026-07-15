"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Robo } from "@/components/ui/Robo";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useChildProfile } from "@/hooks/useChildProfile";

const GREETING = "Halo! Mau belajar sambil bermain?";

const grades = [
  { slug: "tk-a", label: "TK A", tagline: "4–5 tahun", emoji: "🌟", bg: "bg-blush", text: "text-ink" },
  { slug: "tk-b", label: "TK B", tagline: "5–6 tahun", emoji: "⭐", bg: "bg-skyblue", text: "text-ink" },
] as const;

export default function HomePage() {
  const { profile, saveProfile } = useChildProfile();

  return (
    <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center">
      {/* drifting pastel clouds */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute text-6xl opacity-40"
          style={{ top: `${8 + i * 22}%`, left: `${i * 30}%` }}
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 16 + i * 5, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.span>
      ))}

      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}>
        <Robo size={160} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-4xl font-extrabold text-blushdeep sm:text-5xl"
        style={{ textWrap: "balance" }}
      >
        🚀 Petualang STEM
      </motion.h1>

      <div className="mt-3 flex items-center gap-3">
        <p className="text-lg text-inksoft">{GREETING}</p>
        <SpeakButton text={GREETING} />
      </div>

      <div className="mt-10 grid w-full gap-6 sm:grid-cols-2">
        {grades.map((grade, i) => (
          <motion.div
            key={grade.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.15, type: "spring", stiffness: 160, damping: 16 }}
          >
            <Link
              href={`/${grade.slug}`}
              onClick={() => saveProfile({ ...profile, grade: grade.slug })}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -6, rotate: i === 0 ? -1.5 : 1.5 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-[2.5rem] ${grade.bg} p-10 shadow-xl`}
              >
                <motion.div className="text-6xl" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i }}>
                  {grade.emoji}
                </motion.div>
                <div className={`mt-3 text-3xl font-extrabold ${grade.text}`}>{grade.label}</div>
                <div className={`mt-1 text-sm font-semibold opacity-90 ${grade.text}`}>{grade.tagline}</div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link href="/panduan" className="mt-12 text-xs font-semibold text-inksoft underline-offset-4 hover:underline">
        Panduan Guru & Orang Tua
      </Link>
    </div>
  );
}
