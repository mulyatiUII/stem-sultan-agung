import type { ExplorerItem } from "../engines/ExplorerBoard";
import type { Flashcard } from "../engines/FlashcardDeck";
import type { PickRound } from "../engines/PickAnswerGame";
import type { SequenceRound } from "../engines/SequenceBuilder";

/** Content for Literasi Bahasa learning features. */

const ABC: [string, string, string][] = [
  ["A", "Apel", "🍎"],
  ["B", "Bola", "⚽"],
  ["C", "Cicak", "🦎"],
  ["D", "Domba", "🐑"],
  ["E", "Es krim", "🍦"],
  ["F", "Foto", "📷"],
  ["G", "Gajah", "🐘"],
  ["H", "Harimau", "🐯"],
  ["I", "Ikan", "🐟"],
  ["J", "Jeruk", "🍊"],
  ["K", "Kucing", "🐱"],
  ["L", "Lebah", "🐝"],
  ["M", "Monyet", "🐵"],
  ["N", "Nanas", "🍍"],
  ["O", "Obat", "💊"],
  ["P", "Pisang", "🍌"],
  ["Q", "Qari", "📖"],
  ["R", "Rumah", "🏠"],
  ["S", "Sapi", "🐄"],
  ["T", "Topi", "🎩"],
  ["U", "Ular", "🐍"],
  ["V", "Vas bunga", "🏺"],
  ["W", "Wortel", "🥕"],
  ["X", "Xilofon", "🎶"],
  ["Y", "Yoyo", "🪀"],
  ["Z", "Zebra", "🦓"],
];

export const alphabetItems: ExplorerItem[] = ABC.map(([letter, word, emoji]) => ({
  key: letter,
  display: letter,
  name: `${letter} — ${word}`,
  visual: emoji,
  speak: `${letter}! ${letter} untuk ${word}`,
}));

const WORD_POOL: [string, string][] = [
  ["🍎", "APEL"],
  ["⚽", "BOLA"],
  ["🐱", "KUCING"],
  ["📚", "BUKU"],
  ["🥛", "SUSU"],
  ["🏠", "RUMAH"],
  ["🐟", "IKAN"],
  ["🍌", "PISANG"],
  ["🌂", "PAYUNG"],
  ["🚗", "MOBIL"],
];

export const flashcards: Flashcard[] = WORD_POOL.map(([emoji, word]) => ({
  front: emoji,
  back: word,
  speak: word.toLowerCase(),
}));

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** "Audio" feature: hear the word, pick the matching picture. */
export function makeDengarTebakRounds(): PickRound[] {
  return shuffled(WORD_POOL)
    .slice(0, 5)
    .map(([emoji, word]) => {
      const wrong = shuffled(WORD_POOL.filter(([e]) => e !== emoji)).slice(0, 2);
      const options = shuffled([
        { label: emoji, correct: true },
        ...wrong.map(([e]) => ({ label: e })),
      ]);
      return {
        prompt: "Dengarkan, lalu pilih gambarnya!",
        speak: `Mana gambar ${word.toLowerCase()}?`,
        options,
      };
    });
}

const BUILD_WORDS: Record<"tk-a" | "tk-b", [string, string][]> = {
  "tk-a": [
    ["👩", "IBU"],
    ["🔥", "API"],
    ["⚽", "BOLA"],
  ],
  "tk-b": [
    ["📚", "BUKU"],
    ["🥛", "SUSU"],
    ["🍚", "NASI"],
    ["👕", "BAJU"],
  ],
};

export function makeMenyusunKataRounds(grade: "tk-a" | "tk-b"): SequenceRound[] {
  return BUILD_WORDS[grade].map(([emoji, word]) => ({
    hint: emoji,
    hintLabel: word,
    tiles: word.split(""),
    speak: `Susun huruf menjadi kata ${word.toLowerCase()}`,
  }));
}

export function makePuzzleHurufRounds(grade: "tk-a" | "tk-b"): PickRound[] {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const maxStart = grade === "tk-a" ? 8 : 20;
  const starts = shuffled(Array.from({ length: maxStart }, (_, i) => i)).slice(0, 5);

  return starts.map((start) => {
    const seq = letters.slice(start, start + 4).split("");
    const missingIndex = 1 + Math.floor(Math.random() * 2);
    const answer = seq[missingIndex];
    const visual = seq.map((l, i) => (i === missingIndex ? "❓" : l)).join("  ");
    const wrong = shuffled(letters.split("").filter((l) => !seq.includes(l))).slice(0, 2);
    return {
      prompt: "Huruf apa yang hilang?",
      visual,
      speak: "Huruf apa yang hilang?",
      options: shuffled([{ label: answer, correct: true }, ...wrong.map((label) => ({ label }))]),
    };
  });
}
