import type { ActivityResult } from "../entities/ActivityResult";

export interface LeaderboardEntry {
  nickname: string;
  totalStars: number;
  plays: number;
}

export interface ActivityResultRepository {
  create(input: {
    activityId: string;
    nickname: string | null;
    correct: number;
    total: number;
  }): Promise<ActivityResult>;

  /** Star totals per named child, for the simple leaderboard. */
  aggregateByNickname(limit: number): Promise<LeaderboardEntry[]>;
}
