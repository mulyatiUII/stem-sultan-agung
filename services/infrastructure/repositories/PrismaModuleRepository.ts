import { getPrisma } from "@/lib/prisma";
import type { Grade } from "@/types/domain";
import type { ModuleRepository } from "@/services/domain/repositories/ModuleRepository";
import { Module } from "@/services/domain/entities/Module";
import { toDomainModule } from "../mappers/moduleMapper";

export class PrismaModuleRepository implements ModuleRepository {
  async findByGrade(grade: Grade): Promise<Module[]> {
    const modules = await getPrisma().module.findMany({
      where: { grade },
      orderBy: { order: "asc" },
      include: { activities: { orderBy: { order: "asc" } } },
    });

    return modules.map(toDomainModule);
  }

  async findBySlug(grade: Grade, slug: string): Promise<Module | null> {
    const moduleRecord = await getPrisma().module.findUnique({
      where: { slug_grade: { slug, grade } },
      include: { activities: { orderBy: { order: "asc" } } },
    });

    return moduleRecord ? toDomainModule(moduleRecord) : null;
  }
}
