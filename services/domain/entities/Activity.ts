import type { Question } from "./Question";

/** A single playable quiz/activity inside a Module. */
export class Activity {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly order: number,
    public readonly instructionAudioUrl: string | null,
    public readonly moduleSlug: string,
    public readonly questions: Question[] = []
  ) {}

  get questionCount(): number {
    return this.questions.length;
  }

  /** Cross-references submitted choice ids against each question's correct choice. */
  score(answers: { questionId: string; choiceId: string }[]): { correct: number; total: number } {
    const total = this.questions.length;
    let correct = 0;

    for (const question of this.questions) {
      const answer = answers.find((a) => a.questionId === question.id);
      if (!answer) continue;

      const correctChoice = question.choices.find((c) => c.isCorrect);
      if (correctChoice && correctChoice.id === answer.choiceId) {
        correct += 1;
      }
    }

    return { correct, total };
  }
}
