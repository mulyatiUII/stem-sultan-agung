import type { LearningFeatureMeta } from "@/types/learning";
import type { LiteracyCategory } from "@/types/domain";

/**
 * Registry of learning features per world, in teaching order.
 * DB-backed quizzes are appended after these on each world map.
 */
export const LEARNING_FEATURES: LearningFeatureMeta[] = [
  // ── Literasi Bahasa ─────────────────────────────
  {
    slug: "huruf-az",
    category: "BAHASA",
    title: "Huruf A–Z",
    emoji: "🔤",
    subtitle: "Jelajahi 26 huruf dengan suara",
    stem: ["T", "M"],
    stemNote: "Teknologi audio interaktif · urutan abjad melatih pola matematis",
  },
  {
    slug: "flashcard",
    category: "BAHASA",
    title: "Flashcard Kata",
    emoji: "🃏",
    subtitle: "Balik kartu, temukan katanya",
    stem: ["T", "S"],
    stemNote: "Media digital · mengaitkan simbol dengan benda nyata (pengamatan)",
  },
  {
    slug: "dengar-tebak",
    category: "BAHASA",
    title: "Dengar & Tebak",
    emoji: "🔊",
    subtitle: "Dengarkan kata, pilih gambarnya",
    stem: ["T", "S"],
    stemNote: "Teknologi suara · melatih pengamatan bunyi (sains bahasa)",
  },
  {
    slug: "menyusun-kata",
    category: "BAHASA",
    title: "Menyusun Kata",
    emoji: "🧱",
    subtitle: "Rakit huruf menjadi kata",
    stem: ["E", "M"],
    stemNote: "Merakit bagian menjadi utuh (engineering) · urutan posisi (matematika)",
  },
  {
    slug: "puzzle-huruf",
    category: "BAHASA",
    title: "Puzzle Huruf",
    emoji: "🧩",
    subtitle: "Lengkapi urutan huruf yang hilang",
    stem: ["M", "E"],
    stemNote: "Pola & urutan (matematika) · memecahkan masalah bertahap (engineering)",
  },

  // ── Literasi Numerik ────────────────────────────
  {
    slug: "angka",
    category: "NUMERIK",
    title: "Mengenal Angka",
    emoji: "🔢",
    subtitle: "Jelajahi angka dengan benda",
    stem: ["M", "T"],
    stemNote: "Lambang bilangan & banyak benda (matematika) · media interaktif",
  },
  {
    slug: "menghitung",
    category: "NUMERIK",
    title: "Menghitung",
    emoji: "🍎",
    subtitle: "Hitung bendanya, pilih angkanya",
    stem: ["M", "S"],
    stemNote: "Korespondensi satu-satu (matematika) · mengamati & mencacah objek",
  },
  {
    slug: "penjumlahan",
    category: "NUMERIK",
    title: "Penjumlahan",
    emoji: "➕",
    subtitle: "Gabungkan dua kelompok benda",
    stem: ["M", "E"],
    stemNote: "Operasi hitung awal · menggabungkan bagian menjadi keseluruhan",
  },
  {
    slug: "pengurangan",
    category: "NUMERIK",
    title: "Pengurangan",
    emoji: "➖",
    subtitle: "Ambil sebagian, berapa sisanya?",
    stem: ["M", "S"],
    stemNote: "Konsep berkurang (matematika) · sebab-akibat (sains)",
  },
  {
    slug: "puzzle-angka",
    category: "NUMERIK",
    title: "Puzzle Angka",
    emoji: "🧩",
    subtitle: "Angka berapa yang hilang?",
    stem: ["M", "E"],
    stemNote: "Pola bilangan (matematika) · melengkapi struktur (engineering)",
  },

  // ── Literasi Sains ──────────────────────────────
  {
    slug: "hewan",
    category: "SAINS",
    title: "Dunia Hewan",
    emoji: "🦁",
    subtitle: "Kenali hewan, rumah, dan makanannya",
    stem: ["S", "T"],
    stemNote: "Pengamatan makhluk hidup (sains) · ensiklopedia digital",
  },
  {
    slug: "tumbuhan",
    category: "SAINS",
    title: "Tumbuhan Tumbuh",
    emoji: "🌱",
    subtitle: "Urutkan biji sampai berbunga",
    stem: ["S", "E", "M"],
    stemNote: "Daur hidup tanaman (sains) · menyusun tahapan (engineering & urutan)",
  },
  {
    // "cuaca-hari-ini", not "cuaca" — the TK A quiz already owns that slug.
    slug: "cuaca-hari-ini",
    category: "SAINS",
    title: "Cuaca Hari Ini",
    emoji: "⛅",
    subtitle: "Cocokkan cuaca dengan kebutuhannya",
    stem: ["S", "E"],
    stemNote: "Gejala alam (sains) · memilih alat yang tepat (engineering)",
  },
  {
    slug: "tubuh-manusia",
    category: "SAINS",
    title: "Tubuh Manusia",
    emoji: "🧍",
    subtitle: "Kenali anggota tubuh dan fungsinya",
    stem: ["S", "T"],
    stemNote: "Fungsi tubuh & panca indera (sains) · eksplorasi interaktif",
  },
  {
    slug: "planet",
    category: "SAINS",
    title: "Planet & Langit",
    emoji: "🪐",
    subtitle: "Jelajahi matahari dan planet",
    stem: ["S", "M"],
    stemNote: "Benda langit (sains) · urutan & ukuran planet (matematika)",
  },
  {
    slug: "eksperimen",
    category: "SAINS",
    title: "Eksperimen: Tenggelam atau Terapung?",
    emoji: "🧪",
    subtitle: "Tebak dulu, lalu buktikan!",
    stem: ["S", "T", "E", "M"],
    stemNote: "Metode ilmiah: prediksi → uji → amati (S) · simulasi (T) · sifat benda (E) · menghitung tebakan benar (M)",
  },
  {
    slug: "puzzle-sains",
    category: "SAINS",
    title: "Puzzle Sains",
    emoji: "🧩",
    subtitle: "Pasangkan yang berhubungan",
    stem: ["S", "M"],
    stemNote: "Hubungan sebab-akibat di alam (sains) · logika memasangkan (matematika)",
  },
];

export function featuresByCategory(category: LiteracyCategory): LearningFeatureMeta[] {
  return LEARNING_FEATURES.filter((f) => f.category === category);
}

export function findFeature(category: LiteracyCategory, slug: string): LearningFeatureMeta | undefined {
  return LEARNING_FEATURES.find((f) => f.category === category && f.slug === slug);
}

/** Category of each DB-backed quiz slug — used by dashboards to group progress. */
export const QUIZ_SLUG_CATEGORY: Record<string, LiteracyCategory> = {
  "kenali-huruf": "BAHASA",
  "bunyi-awal": "BAHASA",
  "suku-kata": "BAHASA",
  "susun-kata": "BAHASA",
  membilang: "NUMERIK",
  "pola-manik": "NUMERIK",
  berhitung: "NUMERIK",
  "baca-data": "NUMERIK",
  "panca-indera": "SAINS",
  cuaca: "SAINS",
  "hewan-rumahnya": "SAINS",
  "tenggelam-terapung": "SAINS",
};
