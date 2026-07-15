import type { Grade } from "@/types/domain";
import type { ModuleRepository } from "@/services/domain/repositories/ModuleRepository";
import type { ActivityRepository } from "@/services/domain/repositories/ActivityRepository";
import type {
  ActivityResultRepository,
  LeaderboardEntry,
} from "@/services/domain/repositories/ActivityResultRepository";
import { Module } from "@/services/domain/entities/Module";
import { Activity } from "@/services/domain/entities/Activity";
import { ActivityResult } from "@/services/domain/entities/ActivityResult";
import { demoModules } from "../data/demoContent";

/**
 * Zero-infrastructure adapters: same ports as the Prisma repositories,
 * backed by the demo content. Lets the whole app run without a database
 * (results live only for the lifetime of the server process).
 */

export class InMemoryModuleRepository implements ModuleRepository {
  async findByGrade(grade: Grade): Promise<Module[]> {
    return demoModules.filter((m) => m.grade === grade);
  }

  async findBySlug(grade: Grade, slug: string): Promise<Module | null> {
    return demoModules.find((m) => m.grade === grade && m.slug === slug) ?? null;
  }
}

export class InMemoryActivityRepository implements ActivityRepository {
  async findBySlug(moduleSlug: string, activitySlug: string): Promise<Activity | null> {
    for (const mod of demoModules) {
      if (mod.slug !== moduleSlug) continue;
      const activity = mod.activities.find((a) => a.slug === activitySlug);
      if (activity) return activity;
    }
    return null;
  }

  async findById(activityId: string): Promise<Activity | null> {
    for (const mod of demoModules) {
      const activity = mod.activities.find((a) => a.id === activityId);
      if (activity) return activity;
    }
    return null;
  }
}

const storedResults: ActivityResult[] = [];
let resultSequence = 0;

/** Friendly demo rows so the leaderboard is never empty on a fresh install. */
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { nickname: "Aisyah", totalStars: 14, plays: 6 },
  { nickname: "Bima", totalStars: 11, plays: 5 },
  { nickname: "Sari", totalStars: 9, plays: 4 },
  { nickname: "Raka", totalStars: 6, plays: 3 },
  { nickname: "Dewi", totalStars: 4, plays: 2 },
];

export class InMemoryActivityResultRepository implements ActivityResultRepository {
  async create(input: {
    activityId: string;
    nickname: string | null;
    correct: number;
    total: number;
  }): Promise<ActivityResult> {
    resultSequence += 1;
    const result = new ActivityResult(
      `mem-${resultSequence}`,
      input.activityId,
      input.nickname,
      input.correct,
      input.total,
      new Date()
    );
    storedResults.push(result);
    return result;
  }

  async aggregateByNickname(limit: number): Promise<LeaderboardEntry[]> {
    const totals = new Map<string, LeaderboardEntry>();
    for (const entry of DEMO_LEADERBOARD) {
      totals.set(entry.nickname, { ...entry });
    }
    for (const r of storedResults) {
      if (!r.nickname) continue;
      const existing = totals.get(r.nickname) ?? { nickname: r.nickname, totalStars: 0, plays: 0 };
      existing.totalStars += r.stars;
      existing.plays += 1;
      totals.set(r.nickname, existing);
    }
    return [...totals.values()].sort((a, b) => b.totalStars - a.totalStars).slice(0, limit);
  }
}
