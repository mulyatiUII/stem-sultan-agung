import type {
  ActivityResultRepository,
  LeaderboardEntry,
} from "@/services/domain/repositories/ActivityResultRepository";

export class GetLeaderboard {
  constructor(private readonly activityResultRepository: ActivityResultRepository) {}

  async execute(limit = 10): Promise<LeaderboardEntry[]> {
    return this.activityResultRepository.aggregateByNickname(limit);
  }
}
