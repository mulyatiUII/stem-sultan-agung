import type { LiteracyCategory } from "@/types/domain";
import type { ProgressMap } from "@/hooks/useChildProfile";
import { LEARNING_FEATURES, QUIZ_SLUG_CATEGORY } from "@/components/features/learning/meta";

/**
 * Pure gamification rules — no storage, no React. The child profile hook
 * applies these; dashboards read them. Tuning XP/level/badge rules happens
 * only in this file.
 */

// ── XP & Coins ─────────────────────────────────────────
export const XP_PER_PLAY = 10;
export const XP_PER_STAR = 10;
export const COINS_PER_PLAY = 5;
export const COINS_PER_STAR = 5;
export const XP_PER_LEVEL = 100;

export function xpForResult(stars: number): number {
  return XP_PER_PLAY + stars * XP_PER_STAR;
}

export function coinsForResult(stars: number): number {
  return COINS_PER_PLAY + stars * COINS_PER_STAR;
}

// ── Level ──────────────────────────────────────────────
const LEVEL_NAMES = [
  "Penjelajah Baru",
  "Petualang Kecil",
  "Bintang Muda",
  "Penemu Cilik",
  "Ilmuwan Kecil",
  "Kapten STEM",
  "Juara STEM",
];

export interface LevelInfo {
  level: number;
  name: string;
  intoLevel: number;
  toNext: number;
}

export function levelFromXp(xp: number): LevelInfo {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    intoLevel: xp % XP_PER_LEVEL,
    toNext: XP_PER_LEVEL,
  };
}

// ── World badges ───────────────────────────────────────
export interface WorldBadge {
  category: LiteracyCategory;
  title: string;
  emoji: string;
  earned: boolean;
  done: number;
  total: number;
}

/** All activity slugs (learning features + quizzes) belonging to a world. */
export function slugsForCategory(category: LiteracyCategory): string[] {
  return [
    ...LEARNING_FEATURES.filter((f) => f.category === category).map((f) => f.slug),
    ...Object.entries(QUIZ_SLUG_CATEGORY)
      .filter(([, cat]) => cat === category)
      .map(([slug]) => slug),
  ];
}

const BADGE_META: Record<LiteracyCategory, { title: string; emoji: string }> = {
  BAHASA: { title: "Sahabat Kata", emoji: "🏠" },
  NUMERIK: { title: "Jagoan Angka", emoji: "🚀" },
  SAINS: { title: "Ilmuwan Cilik", emoji: "🔬" },
};

export function computeBadges(progress: ProgressMap): WorldBadge[] {
  return (Object.keys(BADGE_META) as LiteracyCategory[]).map((category) => {
    const slugs = slugsForCategory(category);
    const done = slugs.filter((s) => progress[s]).length;
    return {
      category,
      ...BADGE_META[category],
      earned: done === slugs.length,
      done,
      total: slugs.length,
    };
  });
}

// ── Achievements ───────────────────────────────────────
export interface AchievementContext {
  plays: number;
  totalStars: number;
  progress: ProgressMap;
}

export interface AchievementDef {
  id: string;
  title: string;
  emoji: string;
  description: string;
  check: (ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "langkah-pertama",
    title: "Langkah Pertama",
    emoji: "👣",
    description: "Selesaikan aktivitas pertamamu",
    check: (ctx) => ctx.plays >= 1,
  },
  {
    id: "bintang-pertama",
    title: "Bintang Pertama",
    emoji: "⭐",
    description: "Dapatkan bintang pertamamu",
    check: (ctx) => ctx.totalStars >= 1,
  },
  {
    id: "sempurna",
    title: "Sempurna!",
    emoji: "🌟",
    description: "Dapatkan 3 bintang dalam satu aktivitas",
    check: (ctx) => Object.values(ctx.progress).some((p) => p.stars === 3),
  },
  {
    id: "rajin-berlatih",
    title: "Rajin Berlatih",
    emoji: "💪",
    description: "Mainkan 5 aktivitas",
    check: (ctx) => ctx.plays >= 5,
  },
  {
    id: "kolektor-bintang",
    title: "Kolektor Bintang",
    emoji: "✨",
    description: "Kumpulkan 15 bintang",
    check: (ctx) => ctx.totalStars >= 15,
  },
  {
    id: "ilmuwan-air",
    title: "Ilmuwan Air",
    emoji: "🧪",
    description: "Selesaikan eksperimen tenggelam-terapung",
    check: (ctx) => Boolean(ctx.progress["eksperimen"]),
  },
  {
    id: "penjelajah-abjad",
    title: "Penjelajah Abjad",
    emoji: "🔤",
    description: "Jelajahi huruf A sampai Z",
    check: (ctx) => Boolean(ctx.progress["huruf-az"]),
  },
  {
    id: "astronot-cilik",
    title: "Astronot Cilik",
    emoji: "🪐",
    description: "Jelajahi planet dan langit",
    check: (ctx) => Boolean(ctx.progress["planet"]),
  },
  {
    id: "tiga-dunia",
    title: "Penjelajah Tiga Dunia",
    emoji: "🌍",
    description: "Mainkan aktivitas di ketiga dunia literasi",
    check: (ctx) =>
      (["BAHASA", "NUMERIK", "SAINS"] as LiteracyCategory[]).every((cat) =>
        slugsForCategory(cat).some((s) => ctx.progress[s])
      ),
  },
];

export function evaluateAchievements(ctx: AchievementContext, alreadyEarned: string[]): string[] {
  const newly = ACHIEVEMENTS.filter((a) => !alreadyEarned.includes(a.id) && a.check(ctx)).map((a) => a.id);
  return [...alreadyEarned, ...newly];
}

// ── Avatars (coins give collecting a purpose) ──────────
export interface AvatarDef {
  emoji: string;
  cost: number;
}

export const AVATAR_SHOP: AvatarDef[] = [
  { emoji: "🐱", cost: 0 },
  { emoji: "🐰", cost: 0 },
  { emoji: "🐸", cost: 0 },
  { emoji: "🐥", cost: 0 },
  { emoji: "🦁", cost: 30 },
  { emoji: "🐼", cost: 30 },
  { emoji: "🦊", cost: 50 },
  { emoji: "🦄", cost: 80 },
];

export const FREE_AVATARS = AVATAR_SHOP.filter((a) => a.cost === 0).map((a) => a.emoji);
