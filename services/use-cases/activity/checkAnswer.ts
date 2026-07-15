import type { ActivityRepository } from "@/services/domain/repositories/ActivityRepository";

/**
 * Checks one answer server-side so the quiz can give instant benar/salah
 * feedback while the answer key (Choice.isCorrect) never reaches the client.
 */
export class CheckAnswer {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(activityId: string, questionId: string, choiceId: string): Promise<{ correct: boolean } | null> {
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) return null;

    const question = activity.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const correctChoice = question.choices.find((c) => c.isCorrect);
    return { correct: correctChoice?.id === choiceId };
  }
}
