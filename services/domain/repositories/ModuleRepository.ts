import type { Grade } from "@/types/domain";
import type { Module } from "../entities/Module";

/**
 * Port for Module persistence. The use-case layer depends only on this
 * interface; `services/infrastructure` provides the concrete Prisma adapter.
 */
export interface ModuleRepository {
  findByGrade(grade: Grade): Promise<Module[]>;
  findBySlug(grade: Grade, slug: string): Promise<Module | null>;
}
