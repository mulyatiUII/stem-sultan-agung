import type { Grade, LiteracyCategory } from "@/types/domain";
import type { Activity } from "./Activity";

/** Core Module entity — a literacy category (Bahasa/Numerik/Sains) scoped to a grade. */
export class Module {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly category: LiteracyCategory,
    public readonly grade: Grade,
    public readonly description: string | null,
    public readonly icon: string | null,
    public readonly colorTheme: string | null,
    public readonly activities: Activity[] = []
  ) {}

  get activityCount(): number {
    return this.activities.length;
  }
}
