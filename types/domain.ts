/**
 * Framework-agnostic domain types shared across all layers.
 * These mirror the Prisma enums but must not import from `@prisma/client` —
 * the domain layer stays independent of any specific persistence technology.
 */

export type Grade = "TK_A" | "TK_B";

export type LiteracyCategory = "BAHASA" | "NUMERIK" | "SAINS";

export type QuestionType = "MULTIPLE_CHOICE" | "MATCHING" | "PATTERN" | "DRAG_DROP";

export const GRADES: Grade[] = ["TK_A", "TK_B"];

export const LITERACY_CATEGORIES: LiteracyCategory[] = ["BAHASA", "NUMERIK", "SAINS"];
