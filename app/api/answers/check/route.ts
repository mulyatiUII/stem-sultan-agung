import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/lib/container";

const bodySchema = z.object({
  activityId: z.string().min(1),
  questionId: z.string().min(1),
  choiceId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { activityId, questionId, choiceId } = parsed.data;
  const verdict = await container.checkAnswer.execute(activityId, questionId, choiceId);

  if (!verdict) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json(verdict);
}
