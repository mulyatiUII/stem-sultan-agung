import { Module } from "@/services/domain/entities/Module";
import { Activity } from "@/services/domain/entities/Activity";
import { Question } from "@/services/domain/entities/Question";
import { Choice } from "@/services/domain/entities/Choice";
import type { Grade, LiteracyCategory, QuestionType } from "@/types/domain";

/**
 * In-memory course content used when DATA_SOURCE != "postgres".
 * Mirrors what prisma/seed.ts would put in the database, expressed directly
 * as domain entities so the app runs with zero infrastructure.
 */

type ChoiceSpec = [label: string, isCorrect?: boolean];

interface QuestionSpec {
  prompt: string;
  choices: ChoiceSpec[];
  type?: QuestionType;
}

interface ActivitySpec {
  slug: string;
  title: string;
  questions: QuestionSpec[];
}

function buildActivity(idPrefix: string, moduleSlug: string, order: number, spec: ActivitySpec): Activity {
  const questions = spec.questions.map(
    (q, qi) =>
      new Question(
        `${idPrefix}-${spec.slug}-q${qi + 1}`,
        q.type ?? "MULTIPLE_CHOICE",
        q.prompt,
        null,
        null,
        qi + 1,
        q.choices.map(
          ([label, isCorrect], ci) =>
            new Choice(`${idPrefix}-${spec.slug}-q${qi + 1}-c${ci + 1}`, label, null, Boolean(isCorrect), ci + 1)
        )
      )
  );

  return new Activity(`${idPrefix}-${spec.slug}`, spec.slug, spec.title, order, null, moduleSlug, questions);
}

function buildModule(
  grade: Grade,
  category: LiteracyCategory,
  slug: string,
  title: string,
  description: string,
  icon: string,
  activities: ActivitySpec[]
): Module {
  const idPrefix = `${grade === "TK_A" ? "tka" : "tkb"}-${slug}`;
  return new Module(
    idPrefix,
    slug,
    title,
    category,
    grade,
    description,
    icon,
    null,
    activities.map((a, i) => buildActivity(idPrefix, slug, i + 1, a))
  );
}

export const demoModules: Module[] = [
  // ── TK A ──────────────────────────────────────────────
  buildModule("TK_A", "BAHASA", "bahasa", "Rumah Kata", "Mengenal huruf dan bunyi awal kata.", "🏠", [
    {
      slug: "kenali-huruf",
      title: "Kenali Huruf",
      questions: [
        { prompt: "Mana huruf A?", choices: [["A", true], ["B"]] },
        { prompt: "Mana huruf B?", choices: [["C"], ["B", true]] },
        { prompt: "Mana huruf C?", choices: [["C", true], ["D"]] },
      ],
    },
    {
      slug: "bunyi-awal",
      title: "Bunyi Awal Kata",
      questions: [
        { prompt: "🏀 Bola dimulai dengan huruf apa?", choices: [["B", true], ["D"]] },
        { prompt: "🍎 Apel dimulai dengan huruf apa?", choices: [["S"], ["A", true]] },
        { prompt: "Mana yang berawalan huruf M?", choices: [["🍉 Melon", true], ["🍌 Pisang"]] },
      ],
    },
  ]),
  buildModule("TK_A", "NUMERIK", "numerik", "Kota Angka", "Membilang dan mengenal pola sederhana.", "🚀", [
    {
      slug: "membilang",
      title: "Membilang 1–10",
      questions: [
        { prompt: "Ada berapa apel? 🍎🍎🍎", choices: [["3", true], ["5"]] },
        { prompt: "Ada berapa bintang? ⭐⭐", choices: [["4"], ["2", true]] },
        { prompt: "Ada berapa balon? 🎈🎈🎈🎈🎈", choices: [["5", true], ["3"]] },
      ],
    },
    {
      slug: "pola-manik",
      title: "Pola Manik-Manik",
      questions: [
        { prompt: "Manik apa selanjutnya? 🔴🔵🔴🔵❓", choices: [["🔴", true], ["🟢"]], type: "PATTERN" },
        { prompt: "Manik apa selanjutnya? 🔴🟡🟢🔴🟡❓", choices: [["🟢", true], ["🔴"]], type: "PATTERN" },
        { prompt: "Manik apa selanjutnya? 🔵🔵🟡🔵🔵❓", choices: [["🟡", true], ["🔵"]], type: "PATTERN" },
      ],
    },
  ]),
  buildModule("TK_A", "SAINS", "sains", "Kebun Sains", "Mengenal panca indera dan cuaca.", "🌱", [
    {
      slug: "panca-indera",
      title: "Panca Indera",
      questions: [
        { prompt: "Kita melihat dengan…?", choices: [["👁️ Mata", true], ["👂 Telinga"]] },
        { prompt: "Kita mendengar dengan…?", choices: [["👃 Hidung"], ["👂 Telinga", true]] },
        { prompt: "Kita mencium bau dengan…?", choices: [["👃 Hidung", true], ["🖐️ Tangan"]] },
      ],
    },
    {
      slug: "cuaca",
      title: "Mengenal Cuaca",
      questions: [
        { prompt: "Saat hujan, kita memakai…?", choices: [["☂️ Payung", true], ["🕶️ Kacamata hitam"]] },
        { prompt: "Matahari bersinar terang, cuacanya…?", choices: [["🌧️ Hujan"], ["☀️ Cerah", true]] },
        { prompt: "Mana pakaian saat udara dingin?", choices: [["🧥 Jaket", true], ["🩳 Celana pendek"]] },
      ],
    },
  ]),

  // ── TK B ──────────────────────────────────────────────
  buildModule("TK_B", "BAHASA", "bahasa", "Rumah Kata", "Suku kata dan menyusun kata.", "🏠", [
    {
      slug: "suku-kata",
      title: "Suku Kata",
      questions: [
        { prompt: "BU-KU — ada berapa suku kata?", choices: [["2", true], ["4"]] },
        { prompt: "SE-PE-DA — ada berapa suku kata?", choices: [["3", true], ["2"]] },
        { prompt: "MA-TA-HA-RI — ada berapa suku kata?", choices: [["4", true], ["3"]] },
      ],
    },
    {
      slug: "susun-kata",
      title: "Susun Kata",
      questions: [
        { prompt: "b · o · l · a — menjadi kata…?", choices: [["BOLA", true], ["LOBA"]] },
        { prompt: "s · u · s · u — menjadi kata…?", choices: [["USUS"], ["SUSU", true]] },
        { prompt: "i · b · u — menjadi kata…?", choices: [["IBU", true], ["BUI"]] },
      ],
    },
  ]),
  buildModule("TK_B", "NUMERIK", "numerik", "Kota Angka", "Berhitung dan membaca data sederhana.", "🚀", [
    {
      slug: "berhitung",
      title: "Berhitung",
      questions: [
        { prompt: "2 + 1 = ?", choices: [["3", true], ["4"]] },
        { prompt: "3 + 2 = ?", choices: [["5", true], ["6"]] },
        { prompt: "4 − 1 = ?", choices: [["2"], ["3", true]] },
      ],
    },
    {
      slug: "baca-data",
      title: "Membaca Data",
      questions: [
        { prompt: "🍎🍎🍎 🍌🍌 🍇 — buah apa paling banyak?", choices: [["🍎 Apel", true], ["🍇 Anggur"]] },
        { prompt: "🐱🐱 🐶🐶🐶 🐟 — hewan apa paling sedikit?", choices: [["🐟 Ikan", true], ["🐶 Anjing"]] },
        { prompt: "🍬🍬🍬🍬 dibagi 2 anak sama banyak, masing-masing dapat…?", choices: [["2", true], ["4"]] },
      ],
    },
  ]),
  buildModule("TK_B", "SAINS", "sains", "Kebun Sains", "Hewan, rumahnya, dan sifat benda.", "🌱", [
    {
      slug: "hewan-rumahnya",
      title: "Hewan & Rumahnya",
      questions: [
        { prompt: "Ikan tinggal di…?", choices: [["💧 Air", true], ["🌳 Pohon"]] },
        { prompt: "Burung membuat sarang di…?", choices: [["🌳 Pohon", true], ["💧 Air"]] },
        { prompt: "Kelinci suka makan…?", choices: [["🥕 Wortel", true], ["🍖 Daging"]] },
      ],
    },
    {
      slug: "tenggelam-terapung",
      title: "Tenggelam atau Terapung",
      questions: [
        { prompt: "Batu dimasukkan ke air akan…?", choices: [["⬇️ Tenggelam", true], ["⬆️ Terapung"]] },
        { prompt: "Daun di atas air akan…?", choices: [["⬆️ Terapung", true], ["⬇️ Tenggelam"]] },
        { prompt: "Paku besi di air akan…?", choices: [["⬇️ Tenggelam", true], ["⬆️ Terapung"]] },
      ],
    },
  ]),
];
