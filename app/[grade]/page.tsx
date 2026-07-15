import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import { WorldDoor } from "@/components/features/worlds/WorldDoor";
import { BackButton } from "@/components/ui/BackButton";
import { GRADE_LABELS, SLUG_TO_GRADE } from "@/utils/constants";

export default async function GradeMenuPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeSlug } = await params;
  const grade = SLUG_TO_GRADE[gradeSlug];
  if (!grade) notFound();

  const modules = await container.getModulesByGrade.execute(grade);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <BackButton href="/" label="Beranda" />

      <h1 className="mt-6 text-center text-4xl font-extrabold text-ink" style={{ textWrap: "balance" }}>
        Pilih Duniamu, Petualang {GRADE_LABELS[grade]}!
      </h1>
      <p className="mt-2 text-center text-inksoft">Mau bermain di dunia yang mana hari ini?</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {modules.map((moduleSummary, i) => (
          <WorldDoor key={moduleSummary.id} module={moduleSummary} index={i} />
        ))}
      </div>
    </div>
  );
}
