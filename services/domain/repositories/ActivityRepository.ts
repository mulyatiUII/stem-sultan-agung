import type { Activity } from "../entities/Activity";

export interface ActivityRepository {
  findBySlug(moduleSlug: string, activitySlug: string): Promise<Activity | null>;
  findById(activityId: string): Promise<Activity | null>;
}
