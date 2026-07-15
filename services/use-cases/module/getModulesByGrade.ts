import type { Grade } from "@/types/domain";
import type { ModuleSummaryDTO } from "@/types/dto";
import type { ModuleRepository } from "@/services/domain/repositories/ModuleRepository";

export class GetModulesByGrade {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async execute(grade: Grade): Promise<ModuleSummaryDTO[]> {
    const modules = await this.moduleRepository.findByGrade(grade);

    return modules.map((module) => ({
      id: module.id,
      slug: module.slug,
      title: module.title,
      category: module.category,
      grade: module.grade,
      description: module.description,
      icon: module.icon,
      colorTheme: module.colorTheme,
      activityCount: module.activityCount,
    }));
  }
}
