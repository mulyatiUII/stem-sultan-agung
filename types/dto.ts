import type { Grade, LiteracyCategory, QuestionType } from "./domain";

/** Data returned to the presentation layer — plain objects, no ORM leakage. */

export interface ModuleSummaryDTO {
  id: string;
  slug: string;
  title: string;
  category: LiteracyCategory;
  grade: Grade;
  description: string | null;
  icon: string | null;
  colorTheme: string | null;
  activityCount: number;
}

export interface ActivitySummaryDTO {
  id: string;
  slug: string;
  title: string;
  order: number;
  questionCount: number;
}

export interface ModuleDetailDTO extends ModuleSummaryDTO {
  activities: ActivitySummaryDTO[];
}

export interface ChoiceDTO {
  id: string;
  label: string;
  imageUrl: string | null;
}

export interface QuestionDTO {
  id: string;
  type: QuestionType;
  prompt: string;
  audioUrl: string | null;
  imageUrl: string | null;
  choices: ChoiceDTO[];
}

export interface ActivityDetailDTO {
  id: string;
  slug: string;
  title: string;
  instructionAudioUrl: string | null;
  moduleSlug: string;
  questions: QuestionDTO[];
}

export interface SubmitAnswerInput {
  questionId: string;
  choiceId: string;
}

export interface SubmitActivityResultInput {
  activityId: string;
  nickname?: string;
  answers: SubmitAnswerInput[];
}

export interface ActivityResultDTO {
  id: string;
  stars: number;
  correct: number;
  total: number;
  completedAt: string;
}
