import type { Grade } from "@/types/domain";
import type { ModuleDetailDTO } from "@/types/dto";
import type { ModuleRepository } from "@/services/domain/repositories/ModuleRepository";

export class GetModuleDetail {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async execute(grade: Grade, slug: string): Promise<ModuleDetailDTO | null> {
    const moduleEntity = await this.moduleRepository.findBySlug(grade, slug);
    if (!moduleEntity) return null;

    return {
      id: moduleEntity.id,
      slug: moduleEntity.slug,
      title: moduleEntity.title,
      category: moduleEntity.category,
      grade: moduleEntity.grade,
      description: moduleEntity.description,
      icon: moduleEntity.icon,
      colorTheme: moduleEntity.colorTheme,
      activityCount: moduleEntity.activityCount,
      activities: moduleEntity.activities.map((activity) => ({
        id: activity.id,
        slug: activity.slug,
        title: activity.title,
        order: activity.order,
        questionCount: activity.questionCount,
      })),
    };
  }
}
