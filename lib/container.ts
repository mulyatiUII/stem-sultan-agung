import { PrismaModuleRepository } from "@/services/infrastructure/repositories/PrismaModuleRepository";
import { PrismaActivityRepository } from "@/services/infrastructure/repositories/PrismaActivityRepository";
import { PrismaActivityResultRepository } from "@/services/infrastructure/repositories/PrismaActivityResultRepository";
import {
  InMemoryModuleRepository,
  InMemoryActivityRepository,
  InMemoryActivityResultRepository,
} from "@/services/infrastructure/repositories/InMemoryRepositories";
import { GetModulesByGrade } from "@/services/use-cases/module/getModulesByGrade";
import { GetModuleDetail } from "@/services/use-cases/module/getModuleDetail";
import { GetActivityDetail } from "@/services/use-cases/activity/getActivityDetail";
import { CheckAnswer } from "@/services/use-cases/activity/checkAnswer";
import { SubmitActivityResult } from "@/services/use-cases/result/submitActivityResult";
import { GetLeaderboard } from "@/services/use-cases/result/getLeaderboard";

/**
 * Composition root: the only place that wires concrete infrastructure into
 * application use-cases. Routes/handlers import use-cases from here and never
 * instantiate repositories directly.
 *
 * DATA_SOURCE=postgres  -> Prisma + PostgreSQL (production)
 * anything else         -> in-memory demo content (zero-setup development)
 */
const usePostgres = process.env.DATA_SOURCE === "postgres";

const moduleRepository = usePostgres ? new PrismaModuleRepository() : new InMemoryModuleRepository();
const activityRepository = usePostgres ? new PrismaActivityRepository() : new InMemoryActivityRepository();
const activityResultRepository = usePostgres
  ? new PrismaActivityResultRepository()
  : new InMemoryActivityResultRepository();

export const container = {
  getModulesByGrade: new GetModulesByGrade(moduleRepository),
  getModuleDetail: new GetModuleDetail(moduleRepository),
  getActivityDetail: new GetActivityDetail(activityRepository),
  checkAnswer: new CheckAnswer(activityRepository),
  submitActivityResult: new SubmitActivityResult(activityRepository, activityResultRepository),
  getLeaderboard: new GetLeaderboard(activityResultRepository),
};
