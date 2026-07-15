import type { SubmitActivityResultInput, ActivityResultDTO } from "@/types/dto";
import type { ActivityRepository } from "@/services/domain/repositories/ActivityRepository";
import type { ActivityResultRepository } from "@/services/domain/repositories/ActivityResultRepository";

export class ActivityNotFoundError extends Error {
  constructor(activityId: string) {
    super(`Activity not found: ${activityId}`);
    this.name = "ActivityNotFoundError";
  }
}

export class SubmitActivityResult {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly activityResultRepository: ActivityResultRepository
  ) {}

  async execute(input: SubmitActivityResultInput): Promise<ActivityResultDTO> {
    const activity = await this.activityRepository.findById(input.activityId);
    if (!activity) throw new ActivityNotFoundError(input.activityId);

    // Correctness is computed server-side from the stored answer key —
    // the client only ever submits which choice id it picked per question.
    const { correct, total } = activity.score(input.answers);

    const result = await this.activityResultRepository.create({
      activityId: input.activityId,
      nickname: input.nickname ?? null,
      correct,
      total,
    });

    return {
      id: result.id,
      stars: result.stars,
      correct: result.correct,
      total: result.total,
      completedAt: result.completedAt.toISOString(),
    };
  }
}
