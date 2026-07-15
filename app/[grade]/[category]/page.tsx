import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import { WorldMap, type WorldMapItem } from "@/components/features/worlds/WorldMap";
import { BackButton } from "@/components/ui/BackButton";
import { featuresByCategory } from "@/components/features/learning/meta";
import { SLUG_TO_GRADE, SLUG_TO_CATEGORY, WORLDS } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface PageProps {
  params: Promise<{ grade: string; category: string }>;
}

export default async function WorldPage({ params }: PageProps) {
  const { grade: gradeSlug, category: categorySlug } = await params;
  const grade = SLUG_TO_GRADE[gradeSlug];
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!grade || !category) notFound();

  const moduleDetail = await container.getModuleDetail.execute(grade, categorySlug);
  if (!moduleDetail) notFound();

  const world = WORLDS[category];
  const base = `/${gradeSlug}/${categorySlug}`;

  // Learning features come first (in teaching order), DB-backed quizzes close the path.
  const items: WorldMapItem[] = [
    ...featuresByCategory(category).map((f) => ({
      slug: f.slug,
      title: f.title,
      subtitle: f.subtitle,
      emoji: f.emoji,
      href: `${base}/${f.slug}`,
      stem: f.stem,
    })),
    ...moduleDetail.activities.map((activity) => ({
      slug: activity.slug,
      title: `Quiz: ${activity.title}`,
      subtitle: `${activity.questionCount} soal seru`,
      emoji: world.nodeEmoji,
      href: `${base}/${activity.slug}`,
    })),
  ];

  return (
    <div className={cn("min-h-full", world.soft)}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <BackButton href={`/${gradeSlug}`} label="Pilih dunia" />
          <span className={cn("rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold", world.text)}>
            {world.emoji} {world.name}
          </span>
        </div>

        <h1 className={cn("mt-8 text-center text-4xl font-extrabold", world.text)} style={{ textWrap: "balance" }}>
          {world.emoji} {world.name}
        </h1>
        <p className="mt-2 text-center text-inksoft">{moduleDetail.description}</p>

        <div className="mt-12">
          <WorldMap category={category} items={items} />
        </div>
      </div>
    </div>
  );
}
