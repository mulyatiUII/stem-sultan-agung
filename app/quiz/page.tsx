import Link from "next/link";
import { container } from "@/lib/container";
import { BackButton } from "@/components/ui/BackButton";
import { Card } from "@/components/ui/Card";
import { GRADES } from "@/types/domain";
import { GRADE_LABELS, GRADE_SLUGS, CATEGORY_SLUGS, WORLDS } from "@/utils/constants";
import { cn } from "@/utils/cn";

export const metadata = { title: "Quiz — Petualang STEM" };

/** Directory of every quiz across both grades — a quick-start index for teachers. */
export default async function QuizIndexPage() {
  const gradesWithModules = await Promise.all(
    GRADES.map(async (grade) => ({
      grade,
      modules: await container.getModulesByGrade.execute(grade),
    }))
  );

  const details = await Promise.all(
    gradesWithModules.flatMap(({ grade, modules }) =>
      modules.map((m) => container.getModuleDetail.execute(grade, m.slug))
    )
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <BackButton href="/" label="Beranda" />
      <h1 className="mt-6 text-4xl font-extrabold text-ink">⭐ Semua Quiz</h1>
      <p className="mt-2 max-w-[65ch] text-inksoft">
        Daftar lengkap kuis untuk TK A dan TK B — jalan pintas untuk guru memilih aktivitas saat mengajar.
      </p>

      {GRADES.map((grade) => (
        <section key={grade} className="mt-10">
          <h2 className="text-2xl font-extrabold text-ink">{GRADE_LABELS[grade]}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {details
              .filter((d) => d && d.grade === grade)
              .map(
                (moduleDetail) =>
                  moduleDetail && (
                    <Card key={moduleDetail.id} className={WORLDS[moduleDetail.category].soft}>
                      <p className={cn("text-lg font-extrabold", WORLDS[moduleDetail.category].text)}>
                        {WORLDS[moduleDetail.category].emoji} {WORLDS[moduleDetail.category].name}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {moduleDetail.activities.map((activity) => (
                          <li key={activity.id}>
                            <Link
                              href={`/${GRADE_SLUGS[grade]}/${CATEGORY_SLUGS[moduleDetail.category]}/${activity.slug}`}
                              className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-2 text-sm font-bold text-ink transition-transform hover:scale-[1.02]"
                            >
                              {activity.title}
                              <span className="text-xs text-inksoft">{activity.questionCount} soal</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )
              )}
          </div>
        </section>
      ))}
    </div>
  );
}
