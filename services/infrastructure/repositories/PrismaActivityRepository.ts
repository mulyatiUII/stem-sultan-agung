import { prisma } from "@/lib/prisma";
import type { ActivityRepository } from "@/services/domain/repositories/ActivityRepository";
import { Activity } from "@/services/domain/entities/Activity";
import { toDomainActivity } from "../mappers/moduleMapper";

export class PrismaActivityRepository implements ActivityRepository {
  async findBySlug(moduleSlug: string, activitySlug: string): Promise<Activity | null> {
    const activity = await prisma.activity.findFirst({
      where: { slug: activitySlug, module: { slug: moduleSlug } },
      include: { questions: { orderBy: { order: "asc" }, include: { choices: { orderBy: { order: "asc" } } } } },
    });

    return activity ? toDomainActivity(activity, moduleSlug) : null;
  }

  async findById(activityId: string): Promise<Activity | null> {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        module: true,
        questions: { orderBy: { order: "asc" }, include: { choices: { orderBy: { order: "asc" } } } },
      },
    });

    return activity ? toDomainActivity(activity, activity.module.slug) : null;
  }
}
