import { prisma } from "@/lib/prisma";
import type {
  ActivityResultRepository,
  LeaderboardEntry,
} from "@/services/domain/repositories/ActivityResultRepository";
import { ActivityResult } from "@/services/domain/entities/ActivityResult";

export class PrismaActivityResultRepository implements ActivityResultRepository {
  async create(input: {
    activityId: string;
    nickname: string | null;
    correct: number;
    total: number;
  }): Promise<ActivityResult> {
    const stars = input.total === 0 ? 0 : Math.round((input.correct / input.total) * 3);

    const result = await prisma.activityResult.create({
      data: {
        activityId: input.activityId,
        nickname: input.nickname,
        correct: input.correct,
        total: input.total,
        stars,
      },
    });

    return new ActivityResult(
      result.id,
      result.activityId,
      result.nickname,
      result.correct,
      result.total,
      result.completedAt
    );
  }

  async aggregateByNickname(limit: number): Promise<LeaderboardEntry[]> {
    const grouped = await prisma.activityResult.groupBy({
      by: ["nickname"],
      where: { nickname: { not: null } },
      _sum: { stars: true },
      _count: { _all: true },
      orderBy: { _sum: { stars: "desc" } },
      take: limit,
    });

    return grouped.map((g) => ({
      nickname: g.nickname as string,
      totalStars: g._sum.stars ?? 0,
      plays: g._count._all,
    }));
  }
}
