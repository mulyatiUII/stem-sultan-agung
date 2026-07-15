import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import { QuizRunner } from "@/components/features/quiz/QuizRunner";
import { LearningActivity } from "@/components/features/learning/LearningActivity";
import { StemBadges } from "@/components/features/learning/StemBadges";
import { findFeature } from "@/components/features/learning/meta";
import { BackButton } from "@/components/ui/BackButton";
import { SLUG_TO_CATEGORY, SLUG_TO_GRADE, WORLDS } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface PageProps {
  params: Promise<{ grade: string; category: string; activity: string }>;
}

export default async function ActivityPage({ params }: PageProps) {
  const { grade, category, activity: activitySlug } = await params;
  const literacyCategory = SLUG_TO_CATEGORY[category];
  const gradeEnum = SLUG_TO_GRADE[grade];
  if (!literacyCategory || !gradeEnum) notFound();

  const world = WORLDS[literacyCategory];

  // Built-in learning features own their slug; anything else is a DB quiz.
  const feature = findFeature(literacyCategory, activitySlug);

  if (feature) {
    return (
      <div className={cn("min-h-full", world.soft)}>
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BackButton href={`/${grade}/${category}`} label={world.name} />
            <div className="flex items-center gap-2">
              <h1 className={cn("text-xl font-extrabold", world.text)}>
                {feature.emoji} {feature.title}
              </h1>
              <StemBadges aspects={feature.stem} />
            </div>
          </div>
          <p className="mt-2 text-right text-xs text-inksoft">{feature.stemNote}</p>

          <div className="mt-6">
            <LearningActivity slug={activitySlug} category={literacyCategory} grade={grade as "tk-a" | "tk-b"} />
          </div>
        </div>
      </div>
    );
  }

  const activity = await container.getActivityDetail.execute(category, activitySlug);
  if (!activity) notFound();

  return (
    <div className={cn("min-h-full", world.soft)}>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <BackButton href={`/${grade}/${category}`} label={world.name} />
          <h1 className={cn("text-xl font-extrabold", world.text)}>{activity.title}</h1>
        </div>

        <div className="mt-8">
          <QuizRunner activity={activity} />
        </div>
      </div>
    </div>
  );
}
