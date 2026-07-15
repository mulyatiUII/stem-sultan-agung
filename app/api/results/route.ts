import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/lib/container";
import { ActivityNotFoundError } from "@/services/use-cases/result/submitActivityResult";

const bodySchema = z.object({
  activityId: z.string().min(1),
  nickname: z.string().min(1).max(40).optional(),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      choiceId: z.string().min(1),
    })
  ),
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await container.submitActivityResult.execute(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ActivityNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    throw err;
  }
}
