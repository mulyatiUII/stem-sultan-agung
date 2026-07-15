import type { ActivityDetailDTO } from "@/types/dto";
import type { ActivityRepository } from "@/services/domain/repositories/ActivityRepository";

export class GetActivityDetail {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(moduleSlug: string, activitySlug: string): Promise<ActivityDetailDTO | null> {
    const activity = await this.activityRepository.findBySlug(moduleSlug, activitySlug);
    if (!activity) return null;

    return {
      id: activity.id,
      slug: activity.slug,
      title: activity.title,
      instructionAudioUrl: activity.instructionAudioUrl,
      moduleSlug: activity.moduleSlug,
      questions: activity.questions.map((question) => ({
        id: question.id,
        type: question.type,
        prompt: question.prompt,
        audioUrl: question.audioUrl,
        imageUrl: question.imageUrl,
        // isCorrect intentionally stripped — never send the answer key to the client.
        choices: question.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          imageUrl: choice.imageUrl,
        })),
      })),
    };
  }
}
