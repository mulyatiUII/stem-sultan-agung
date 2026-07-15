"use client";

import { useChildProfile } from "@/hooks/useChildProfile";
import { levelFromXp } from "@/utils/gamification";
import { BackButton } from "@/components/ui/BackButton";
import { DataTable } from "@/components/ui/DataTable";
import { StarRating } from "@/components/ui/StarRating";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { WorldProgressBars } from "@/components/features/dashboard/WorldProgressBars";
import { WeeklyChart } from "@/components/features/dashboard/WeeklyChart";
import { StemAspectBars } from "@/components/features/dashboard/StemAspectBars";
import { LeaderboardTable } from "@/components/features/dashboard/LeaderboardTable";
import { LEARNING_FEATURES } from "@/components/features/learning/meta";

/** Dashboard perkembangan belajar anak — ringkasan gamifikasi + progres per dunia. */
export default function PerkembanganPage() {
  const { profile, progress, stats, totalStars, isLoaded } = useChildProfile();
  if (!isLoaded) return null;

  const level = levelFromXp(stats.xp);

  const historyRows = Object.entries(progress)
    .sort(([, a], [, b]) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .map(([slug, entry]) => {
      const feature = LEARNING_FEATURES.find((f) => f.slug === slug);
      return [
        new Date(entry.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        feature ? `${feature.emoji} ${feature.title}` : `⭐ Quiz: ${slug}`,
        <StarRating key={slug} stars={entry.stars} size="sm" />,
        `${entry.correct}/${entry.total}`,
      ];
    });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <BackButton href="/profil" label="Profil" />

      <h1 className="mt-6 text-3xl font-extrabold text-ink">
        📊 Perkembangan Belajar {profile.name || "Petualang"} {profile.avatar}
      </h1>
      <p className="mt-1 text-inksoft">
        Jenjang {profile.grade === "tk-a" ? "TK A" : "TK B"} · perkembangan tersimpan di perangkat ini
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Level" value={`${level.level}`} hint={level.name} index={0} />
        <StatCard label="XP" value={`${stats.xp}`} index={1} />
        <StatCard label="Bintang" value={`⭐ ${totalStars}`} index={2} />
        <StatCard label="Koin" value={`🪙 ${stats.coins}`} index={3} />
        <StatCard label="Petualangan" value={`${stats.plays}`} hint="kali bermain" index={4} />
      </div>

      <h2 className="mt-10 text-xl font-extrabold text-ink">Progres per Dunia</h2>
      <div className="mt-4">
        <WorldProgressBars progress={progress} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <WeeklyChart progress={progress} />
        <StemAspectBars progress={progress} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <LeaderboardTable />
        <div>
          <h2 className="mb-3 text-xl font-extrabold text-ink">Riwayat Aktivitas</h2>
          <DataTable
            headers={["Tanggal", "Aktivitas", "Bintang", "Benar"]}
            rows={historyRows}
            emptyMessage="Belum ada aktivitas — ayo mulai bermain!"
          />
        </div>
      </div>
    </div>
  );
}
