import { NextResponse } from "next/server";
import { container } from "@/lib/container";

interface RouteParams {
  params: Promise<{ moduleSlug: string; activitySlug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { moduleSlug, activitySlug } = await params;
  const activity = await container.getActivityDetail.execute(moduleSlug, activitySlug);

  if (!activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  return NextResponse.json(activity);
}
