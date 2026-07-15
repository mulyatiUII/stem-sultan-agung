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
import { LEARNING_FEATURES } from "@/components/features/learning/meta";

/**
 * Saran kegiatan tanpa layar, diturunkan dari aktivitas yang baru selesai —
 * jembatan dari aplikasi ke dunia nyata (lihat dokumen desain).
 */
function buildSuggestions(progressSlugs: string[]): string[] {
  const suggestions: string[] = [];
  if (progressSlugs.includes("pola-manik") || progressSlugs.includes("menyusun-kata")) {
    suggestions.push("Coba buat pola 3 warna dengan kancing baju atau tutup botol di rumah.");
  }
  if (progressSlugs.includes("eksperimen")) {
    suggestions.push("Ulangi eksperimen tenggelam-terapung sungguhan di ember: batu, daun, sendok.");
  }
  if (progressSlugs.includes("huruf-az") || progressSlugs.includes("flashcard")) {
    suggestions.push("Tunjuk benda di rumah dan tanyakan bunyi huruf awalnya (Meja... M!).");
  }
  if (progressSlugs.includes("menghitung") || progressSlugs.includes("penjumlahan")) {
    suggestions.push("Ajak menghitung benda nyata: anak tangga, piring di meja, mainan di rak.");
  }
  if (progressSlugs.includes("tumbuhan")) {
    suggestions.push("Tanam biji kacang hijau di kapas basah, amati bersama setiap pagi.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Mulai dari satu aktivitas pendek (5–10 menit) dan dampingi anak saat bermain.");
  }
  return suggestions.slice(0, 3);
}

export default function OrtuPage() {
  const { profile, progress, stats, totalStars, isLoaded } = useChildProfile();
  if (!isLoaded) return null;

  const level = levelFromXp(stats.xp);
  const suggestions = buildSuggestions(Object.keys(progress));

  const historyRows = Object.entries(progress)
    .sort(([, a], [, b]) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .map(([slug, entry]) => {
      const feature = LEARNING_FEATURES.find((f) => f.slug === slug);
      return [
        new Date(entry.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        feature ? `${feature.emoji} ${feature.title}` : `⭐ Quiz: ${slug}`,
        <StarRating key={slug} stars={entry.stars} size="sm" />,
        `${entry.correct}/${entry.total}`,
      ];
    });

  return (
    <div className="min-h-full bg-lilacsoft/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <BackButton href="/" label="Beranda" />

        <h1 className="mt-6 text-3xl font-extrabold text-ink">Dashboard Orang Tua</h1>
        <p className="mt-1 max-w-[65ch] text-inksoft">
          Perkembangan {profile.name ? <b>{profile.name}</b> : "anak Anda"} ({profile.grade === "tk-a" ? "TK A" : "TK B"}) di
          perangkat ini. Data tersimpan lokal — tidak ada informasi anak yang dikirim ke internet.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Aktivitas selesai" value={`${Object.keys(progress).length}`} index={0} />
          <StatCard label="Total bintang" value={`⭐ ${totalStars}`} index={1} />
          <StatCard label="Kali bermain" value={`${stats.plays}`} index={2} />
          <StatCard label="Level anak" value={`${level.level}`} hint={level.name} index={3} />
        </div>

        <h2 className="mt-10 text-xl font-extrabold text-ink">Capaian per Literasi</h2>
        <div className="mt-4">
          <WorldProgressBars progress={progress} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <WeeklyChart progress={progress} />
          <StemAspectBars progress={progress} />
        </div>

        {/* saran pendampingan */}
        <div className="mt-6 rounded-2xl bg-lilacsoft p-6">
          <h2 className="text-lg font-extrabold text-lilacdeep">💡 Saran Pendampingan di Rumah</h2>
          <ul className="mt-3 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span aria-hidden>•</span> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-lilacdeep/80">
            Aplikasi ini dirancang untuk dimainkan bersama pendampingan — rayakan bintang sekecil apa pun, dan
            berhentilah selagi anak masih senang.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-extrabold text-ink">Riwayat Aktivitas</h2>
        <div className="mt-4">
          <DataTable
            headers={["Tanggal", "Aktivitas", "Bintang", "Benar"]}
            rows={historyRows}
            emptyMessage="Belum ada aktivitas yang diselesaikan."
          />
        </div>
      </div>
    </div>
  );
}
