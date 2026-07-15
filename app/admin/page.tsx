import { container } from "@/lib/container";
import { BackButton } from "@/components/ui/BackButton";
import { DataTable } from "@/components/ui/DataTable";
import { StemBadges } from "@/components/features/learning/StemBadges";
import { LEARNING_FEATURES, featuresByCategory } from "@/components/features/learning/meta";
import { GRADES } from "@/types/domain";
import { GRADE_LABELS, WORLDS, CATEGORY_SLUGS } from "@/utils/constants";
import { cn } from "@/utils/cn";

export const metadata = { title: "Admin — Petualang STEM" };

/** Dashboard Admin: inventori konten (fitur belajar + kuis) dan statistik. */
export default async function AdminPage() {
  const dataSource = process.env.DATA_SOURCE === "postgres" ? "PostgreSQL (Prisma)" : "Demo in-memory";

  const gradeDetails = await Promise.all(
    GRADES.map(async (grade) => {
      const modules = await container.getModulesByGrade.execute(grade);
      const details = await Promise.all(modules.map((m) => container.getModuleDetail.execute(grade, m.slug)));
      return { grade, details: details.filter((d) => d !== null) };
    })
  );

  const quizCount = gradeDetails.reduce(
    (sum, g) => sum + g.details.reduce((s, d) => s + d.activities.length, 0),
    0
  );
  const questionCount = gradeDetails.reduce(
    (sum, g) => sum + g.details.reduce((s, d) => s + d.activities.reduce((q, a) => q + a.questionCount, 0), 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <BackButton href="/" label="Beranda" />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Dashboard Admin</h1>
        <span className="rounded-full bg-skysoft px-4 py-1.5 text-xs font-bold text-skydeep">
          Sumber data: {dataSource}
        </span>
      </div>
      <p className="mt-1 max-w-[65ch] text-inksoft">
        Inventori konten pembelajaran. Kuis dikelola lewat database (lihat <code>prisma/seed.ts</code>);
        fitur belajar interaktif dikelola di <code>components/features/learning</code>.
      </p>

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Fitur belajar", value: `${LEARNING_FEATURES.length}`, hint: "interaktif built-in" },
          { label: "Kuis", value: `${quizCount}`, hint: "TK A + TK B" },
          { label: "Soal kuis", value: `${questionCount}`, hint: "di semua kuis" },
          { label: "Jenjang", value: "2", hint: "TK A · TK B" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-md shadow-ink/5">
            <p className="text-2xl font-extrabold text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
              {s.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-inksoft">{s.label}</p>
            <p className="mt-1 text-xs text-inksoft">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* content tree */}
      <h2 className="mt-10 text-xl font-extrabold text-ink">Pohon Konten</h2>
      <div className="mt-4 space-y-4">
        {(["BAHASA", "NUMERIK", "SAINS"] as const).map((category) => {
          const world = WORLDS[category];
          const features = featuresByCategory(category);
          return (
            <div key={category} className={cn("rounded-2xl p-5", world.soft)}>
              <p className={cn("font-extrabold", world.text)}>
                {world.emoji} {world.name} <span className="font-normal text-inksoft">/{CATEGORY_SLUGS[category]}</span>
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f.slug} className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-4 py-2">
                    <span className="text-sm font-bold text-ink">
                      {f.emoji} {f.title}
                    </span>
                    <StemBadges aspects={f.stem} />
                  </div>
                ))}
              </div>

              {gradeDetails.map(({ grade, details }) => {
                const detail = details.find((d) => d.category === category);
                if (!detail) return null;
                return (
                  <div key={grade} className="mt-2 grid gap-2 sm:grid-cols-2">
                    {detail.activities.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl bg-white/50 px-4 py-2">
                        <span className="text-sm text-ink">
                          ⭐ Quiz: {a.title} <span className="text-xs text-inksoft">({GRADE_LABELS[grade]})</span>
                        </span>
                        <span className="text-xs text-inksoft" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {a.questionCount} soal
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* class demo table */}
      <h2 className="mt-10 text-xl font-extrabold text-ink">
        Pantauan Kelas <span className="rounded-full bg-sunsoft px-3 py-1 text-xs font-bold text-sundeep">data contoh</span>
      </h2>
      <p className="mt-1 max-w-[65ch] text-sm text-inksoft">
        Pantauan lintas-perangkat membutuhkan mode PostgreSQL (set <code>DATA_SOURCE=postgres</code>) — tabel di
        bawah adalah ilustrasi tampilannya.
      </p>
      <div className="mt-4">
        <DataTable
          headers={["Nama", "Kelas", "Aktivitas terakhir", "Rata-rata bintang", "Catatan"]}
          rows={[
            ["Aisyah", "TK A Melati", "Pola Manik-Manik", "⭐ 2.8", "—"],
            ["Bima", "TK A Melati", "Menghitung", "⭐ 2.2", "Mengulang soal yang sama 2×"],
            ["Sari", "TK B Mawar", "Eksperimen", "⭐ 2.5", "—"],
            ["Raka", "TK B Mawar", "Suku Kata", "⭐ 1.8", "Belum bermain 7 hari"],
          ]}
        />
      </div>
    </div>
  );
}
