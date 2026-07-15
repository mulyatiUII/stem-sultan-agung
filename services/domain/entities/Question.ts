import type { QuestionType } from "@/types/domain";
import type { Choice } from "./Choice";

export class Question {
  constructor(
    public readonly id: string,
    public readonly type: QuestionType,
    public readonly prompt: string,
    public readonly audioUrl: string | null,
    public readonly imageUrl: string | null,
    public readonly order: number,
    public readonly choices: Choice[] = []
  ) {}
}
