import type { ExplorerItem } from "../engines/ExplorerBoard";
import type { PickRound } from "../engines/PickAnswerGame";

/** Content for Literasi Numerik learning features. Difficulty scales by grade. */

const NUMBER_NAMES = [
  "nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas",
  "delapan belas", "sembilan belas", "dua puluh",
];

const COUNT_EMOJIS = ["🍎", "⭐", "🎈", "🌸", "🐟", "🍪", "🚗", "🦋"];

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Distinct wrong number options near the answer, always >= 0. */
function numberOptions(answer: number, max: number): { label: string; correct?: boolean }[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 2) {
    const candidate = Math.max(0, Math.min(max, answer + randomInt(-3, 3)));
    if (candidate !== answer) wrongs.add(candidate);
  }
  return shuffled([
    { label: String(answer), correct: true },
    ...[...wrongs].map((n) => ({ label: String(n) })),
  ]);
}

export function numberItems(grade: "tk-a" | "tk-b"): ExplorerItem[] {
  const max = grade === "tk-a" ? 10 : 20;
  return Array.from({ length: max }, (_, i) => {
    const n = i + 1;
    const emoji = COUNT_EMOJIS[i % COUNT_EMOJIS.length];
    return {
      key: String(n),
      display: String(n),
      name: `${n} — ${NUMBER_NAMES[n]}`,
      visual: emoji.repeat(Math.min(n, 10)) + (n > 10 ? ` +${n - 10}` : ""),
      speak: `${NUMBER_NAMES[n]}!`,
    };
  });
}

export function makeMenghitungRounds(grade: "tk-a" | "tk-b"): PickRound[] {
  const max = grade === "tk-a" ? 5 : 10;
  return Array.from({ length: 5 }, () => {
    const n = randomInt(1, max);
    const emoji = COUNT_EMOJIS[randomInt(0, COUNT_EMOJIS.length - 1)];
    return {
      prompt: "Ada berapa banyak?",
      visual: emoji.repeat(n),
      speak: "Coba hitung, ada berapa banyak?",
      options: numberOptions(n, max),
    };
  });
}

export function makePenjumlahanRounds(grade: "tk-a" | "tk-b"): PickRound[] {
  const maxSum = grade === "tk-a" ? 5 : 10;
  return Array.from({ length: 5 }, () => {
    const a = randomInt(1, maxSum - 1);
    const b = randomInt(1, maxSum - a);
    const emoji = COUNT_EMOJIS[randomInt(0, COUNT_EMOJIS.length - 1)];
    return {
      prompt: `${a} + ${b} = ?`,
      visual: `${emoji.repeat(a)} ➕ ${emoji.repeat(b)}`,
      speak: `${NUMBER_NAMES[a]} ditambah ${NUMBER_NAMES[b]}, berapa semuanya?`,
      options: numberOptions(a + b, maxSum),
    };
  });
}

export function makePenguranganRounds(grade: "tk-a" | "tk-b"): PickRound[] {
  const max = grade === "tk-a" ? 5 : 10;
  return Array.from({ length: 5 }, () => {
    const a = randomInt(2, max);
    const b = randomInt(1, a - 1);
    const emoji = COUNT_EMOJIS[randomInt(0, COUNT_EMOJIS.length - 1)];
    return {
      prompt: `${a} − ${b} = ?`,
      visual: `${emoji.repeat(a)} ➖ ${emoji.repeat(b)}`,
      speak: `Ada ${NUMBER_NAMES[a]}, diambil ${NUMBER_NAMES[b]}. Berapa sisanya?`,
      options: numberOptions(a - b, max),
    };
  });
}

export function makePuzzleAngkaRounds(grade: "tk-a" | "tk-b"): PickRound[] {
  const maxStart = grade === "tk-a" ? 7 : 17;
  return Array.from({ length: 5 }, () => {
    const start = randomInt(1, maxStart);
    const seq = [start, start + 1, start + 2, start + 3];
    const missingIndex = randomInt(1, 2);
    const answer = seq[missingIndex];
    return {
      prompt: "Angka berapa yang hilang?",
      visual: seq.map((n, i) => (i === missingIndex ? "❓" : String(n))).join("  "),
      speak: "Angka berapa yang hilang?",
      options: numberOptions(answer, maxStart + 3),
    };
  });
}
