import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/lib/container";

const querySchema = z.object({
  grade: z.enum(["TK_A", "TK_B"]),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    grade: request.nextUrl.searchParams.get("grade"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid or missing `grade` query param" }, { status: 400 });
  }

  const modules = await container.getModulesByGrade.execute(parsed.data.grade);
  return NextResponse.json(modules);
}
