/** A completed attempt at an Activity, expressed as a star rating (1–3). */
export class ActivityResult {
  constructor(
    public readonly id: string,
    public readonly activityId: string,
    public readonly nickname: string | null,
    public readonly correct: number,
    public readonly total: number,
    public readonly completedAt: Date
  ) {}

  get stars(): number {
    if (this.total === 0) return 0;
    const ratio = this.correct / this.total;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.6) return 2;
    if (ratio > 0) return 1;
    return 0;
  }
}
