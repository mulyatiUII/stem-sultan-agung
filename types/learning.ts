import type { LiteracyCategory } from "./domain";

/** Which STEM aspects an activity develops (shown as badges to teachers/parents). */
export type StemAspect = "S" | "T" | "E" | "M";

export const STEM_LABELS: Record<StemAspect, string> = {
  S: "Science",
  T: "Technology",
  E: "Engineering",
  M: "Mathematics",
};

/**
 * A built-in interactive learning feature (huruf A–Z, flashcard, puzzle, ...).
 * Unlike DB-backed quizzes these are rich client-side experiences; they share
 * the same world-map path and progress store as quizzes via their slug.
 */
export interface LearningFeatureMeta {
  slug: string;
  category: LiteracyCategory;
  title: string;
  emoji: string;
  subtitle: string;
  stem: StemAspect[];
  stemNote: string;
}
