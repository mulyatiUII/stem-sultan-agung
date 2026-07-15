"use client";

import type { LiteracyCategory } from "@/types/domain";
import { ExplorerBoard } from "./engines/ExplorerBoard";
import { FlashcardDeck } from "./engines/FlashcardDeck";
import { PickAnswerGame } from "./engines/PickAnswerGame";
import { SequenceBuilder } from "./engines/SequenceBuilder";
import { SinkFloatLab } from "./engines/SinkFloatLab";
import {
  alphabetItems,
  flashcards,
  makeDengarTebakRounds,
  makeMenyusunKataRounds,
  makePuzzleHurufRounds,
} from "./content/bahasa";
import {
  numberItems,
  makeMenghitungRounds,
  makePenjumlahanRounds,
  makePenguranganRounds,
  makePuzzleAngkaRounds,
} from "./content/numerik";
import {
  animalItems,
  bodyItems,
  planetItems,
  labObjects,
  makeTumbuhanRounds,
  makeCuacaRounds,
  makePuzzleSainsRounds,
} from "./content/sains";
import { findFeature } from "./meta";

type GradeSlug = "tk-a" | "tk-b";

interface LearningActivityProps {
  slug: string;
  category: LiteracyCategory;
  grade: GradeSlug;
}

/**
 * Maps a learning-feature slug to its engine + content configuration.
 * Adding a feature = one meta entry + one case here + content data.
 */
export function LearningActivity({ slug, category, grade }: LearningActivityProps) {
  const meta = findFeature(category, slug);
  if (!meta) return null;

  const common = { slug, title: meta.title };

  switch (slug) {
    // ── Bahasa ──
    case "huruf-az":
      return (
        <ExplorerBoard
          {...common}
          instruction="Sentuh hurufnya, dengarkan bunyinya! Jelajahi semua huruf ya!"
          items={alphabetItems}
          tile="sm"
        />
      );
    case "flashcard":
      return (
        <FlashcardDeck
          {...common}
          instruction="Sentuh kartu untuk membaliknya, lalu dengarkan katanya!"
          cards={flashcards}
        />
      );
    case "dengar-tebak":
      return (
        <PickAnswerGame
          {...common}
          instruction="Dengarkan baik-baik, lalu pilih gambar yang cocok!"
          makeRounds={makeDengarTebakRounds}
        />
      );
    case "menyusun-kata":
      return (
        <SequenceBuilder
          {...common}
          instruction="Susun huruf-huruf menjadi kata! Sentuh huruf yang benar satu per satu."
          rounds={makeMenyusunKataRounds(grade)}
        />
      );
    case "puzzle-huruf":
      return (
        <PickAnswerGame
          {...common}
          instruction="Ada huruf yang hilang! Temukan huruf yang tepat."
          makeRounds={() => makePuzzleHurufRounds(grade)}
        />
      );

    // ── Numerik ──
    case "angka":
      return (
        <ExplorerBoard
          {...common}
          instruction="Sentuh angkanya, lihat berapa banyak bendanya!"
          items={numberItems(grade)}
          tile="sm"
        />
      );
    case "menghitung":
      return (
        <PickAnswerGame
          {...common}
          instruction="Hitung bendanya satu per satu, lalu pilih angkanya!"
          makeRounds={() => makeMenghitungRounds(grade)}
        />
      );
    case "penjumlahan":
      return (
        <PickAnswerGame
          {...common}
          instruction="Gabungkan dua kelompok benda. Berapa jumlah semuanya?"
          makeRounds={() => makePenjumlahanRounds(grade)}
        />
      );
    case "pengurangan":
      return (
        <PickAnswerGame
          {...common}
          instruction="Ada yang diambil! Berapa sisanya?"
          makeRounds={() => makePenguranganRounds(grade)}
        />
      );
    case "puzzle-angka":
      return (
        <PickAnswerGame
          {...common}
          instruction="Ada angka yang hilang! Angka berapa ya?"
          makeRounds={() => makePuzzleAngkaRounds(grade)}
        />
      );

    // ── Sains ──
    case "hewan":
      return (
        <ExplorerBoard
          {...common}
          instruction="Sentuh hewannya! Kenali rumah dan makanannya."
          items={animalItems}
        />
      );
    case "tumbuhan":
      return (
        <SequenceBuilder
          {...common}
          instruction="Urutkan tahap tumbuhnya! Mulai dari yang paling awal."
          rounds={makeTumbuhanRounds(grade)}
        />
      );
    case "cuaca-hari-ini":
      return (
        <PickAnswerGame
          {...common}
          instruction="Lihat cuacanya, pilih benda yang cocok!"
          makeRounds={makeCuacaRounds}
        />
      );
    case "tubuh-manusia":
      return (
        <ExplorerBoard
          {...common}
          instruction="Sentuh anggota tubuhnya, kenali fungsinya!"
          items={bodyItems}
        />
      );
    case "planet":
      return (
        <ExplorerBoard
          {...common}
          instruction="Jelajahi langit! Sentuh matahari, bulan, dan planet-planet."
          items={planetItems}
        />
      );
    case "eksperimen":
      return (
        <SinkFloatLab
          {...common}
          instruction="Jadilah ilmuwan! Tebak dulu: tenggelam atau terapung? Lalu buktikan!"
          objects={labObjects}
        />
      );
    case "puzzle-sains":
      return (
        <PickAnswerGame
          {...common}
          instruction="Pasangkan yang saling berhubungan!"
          makeRounds={makePuzzleSainsRounds}
        />
      );

    default:
      return null;
  }
}
