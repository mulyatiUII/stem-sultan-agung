import type { Grade, LiteracyCategory } from "@/types/domain";

export const GRADE_LABELS: Record<Grade, string> = {
  TK_A: "TK A",
  TK_B: "TK B",
};

export const GRADE_SLUGS: Record<Grade, string> = {
  TK_A: "tk-a",
  TK_B: "tk-b",
};

export const SLUG_TO_GRADE: Record<string, Grade> = {
  "tk-a": "TK_A",
  "tk-b": "TK_B",
};

export const CATEGORY_LABELS: Record<LiteracyCategory, string> = {
  BAHASA: "Literasi Bahasa",
  NUMERIK: "Literasi Numerik",
  SAINS: "Literasi Sains",
};

export const CATEGORY_SLUGS: Record<LiteracyCategory, string> = {
  BAHASA: "bahasa",
  NUMERIK: "numerik",
  SAINS: "sains",
};

export const SLUG_TO_CATEGORY: Record<string, LiteracyCategory> = {
  bahasa: "BAHASA",
  numerik: "NUMERIK",
  sains: "SAINS",
};

/**
 * Each literacy module is presented to children as a themed "world".
 * Color is a navigation device: mint = Bahasa, sky = Numerik, sun = Sains.
 */
export interface WorldTheme {
  name: string;
  emoji: string;
  nodeEmoji: string;
  tagline: string;
  bg: string;
  soft: string;
  text: string;
  button: string;
}

export const WORLDS: Record<LiteracyCategory, WorldTheme> = {
  BAHASA: {
    name: "Rumah Kata",
    emoji: "🏠",
    nodeEmoji: "🏡",
    tagline: "Bermain huruf dan kata",
    bg: "bg-mint",
    soft: "bg-mintsoft",
    text: "text-mintdeep",
    button: "bg-mint hover:bg-mint/80 text-mintdeep",
  },
  NUMERIK: {
    name: "Kota Angka",
    emoji: "🚀",
    nodeEmoji: "🪐",
    tagline: "Berpetualang dengan angka",
    bg: "bg-skyblue",
    soft: "bg-skysoft",
    text: "text-skydeep",
    button: "bg-skyblue hover:bg-skyblue/80 text-skydeep",
  },
  SAINS: {
    name: "Kebun Sains",
    emoji: "🌱",
    nodeEmoji: "🌸",
    tagline: "Menjelajah alam sekitar",
    bg: "bg-sunny",
    soft: "bg-sunsoft",
    text: "text-sundeep",
    button: "bg-sunny hover:bg-sunny/80 text-sundeep",
  },
};

export const AVATARS = ["🐱", "🐰", "🦁", "🐸", "🐼", "🦊", "🐨", "🐥"];
