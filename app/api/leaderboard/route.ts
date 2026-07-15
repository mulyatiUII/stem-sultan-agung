import { NextResponse } from "next/server";
import { container } from "@/lib/container";

export async function GET() {
  const entries = await container.getLeaderboard.execute(10);
  return NextResponse.json(entries);
}
