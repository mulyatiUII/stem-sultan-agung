export class Choice {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly imageUrl: string | null,
    public readonly isCorrect: boolean,
    public readonly order: number
  ) {}
}
