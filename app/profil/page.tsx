"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useSpeech } from "@/hooks/useSpeech";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import {
  levelFromXp,
  computeBadges,
  ACHIEVEMENTS,
  AVATAR_SHOP,
} from "@/utils/gamification";
import { cn } from "@/utils/cn";

export default function ProfilPage() {
  const { profile, saveProfile, stats, totalStars, unlockAvatar, resetProgress, isLoaded, progress } =
    useChildProfile();
  const { speak } = useSpeech();

  const level = levelFromXp(stats.xp);
  const badges = computeBadges(progress);

  function chooseAvatar(emoji: string, cost: number) {
    const owned = stats.unlockedAvatars.includes(emoji);
    if (owned) {
      saveProfile({ ...profile, avatar: emoji });
      speak("Avatar baru! Keren!");
      return;
    }
    if (unlockAvatar(emoji, cost)) {
      saveProfile({ ...profile, avatar: emoji });
      speak("Avatar baru terbuka! Keren!");
    } else {
      speak("Koinmu belum cukup. Ayo main lagi untuk mengumpulkan koin!");
    }
  }

  if (!isLoaded) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <BackButton href="/" label="Beranda" />

      {/* identity */}
      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-blushsoft text-7xl shadow-lg"
        >
          {profile.avatar}
        </motion.div>

        <div className="w-full">
          <label htmlFor="nama" className="text-xs font-bold uppercase tracking-wide text-inksoft">
            Namaku
          </label>
          <input
            id="nama"
            value={profile.name}
            onChange={(e) => saveProfile({ ...profile, name: e.target.value })}
            placeholder="Tulis namamu di sini…"
            maxLength={20}
            className="mt-1 w-full rounded-2xl border-4 border-blushsoft bg-white px-5 py-3 text-xl font-extrabold text-ink focus:border-blush focus:outline-none"
          />

          <div className="mt-3 flex gap-2">
            {(["tk-a", "tk-b"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => saveProfile({ ...profile, grade: g })}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-extrabold transition-colors",
                  profile.grade === g ? "bg-skyblue text-skydeep" : "bg-white text-inksoft shadow-sm"
                )}
              >
                {g === "tk-a" ? "🌟 TK A" : "⭐ TK B"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* level & currency */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-lilacsoft p-5 sm:col-span-2">
          <div className="flex items-baseline justify-between">
            <p className="font-extrabold text-lilacdeep">
              Level {level.level} — {level.name}
            </p>
            <p className="text-xs font-bold text-lilacdeep" style={{ fontVariantNumeric: "tabular-nums" }}>
              {level.intoLevel}/{level.toNext} XP
            </p>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/70">
            <motion.div
              className="h-full rounded-full bg-lilac"
              initial={{ width: 0 }}
              animate={{ width: `${(level.intoLevel / level.toNext) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="mt-2 text-xs text-lilacdeep/80">Total {stats.xp} XP dari {stats.plays} petualangan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-around rounded-2xl bg-sunsoft p-5"
        >
          <div className="text-center">
            <p className="text-2xl font-extrabold text-sundeep" style={{ fontVariantNumeric: "tabular-nums" }}>
              🪙 {stats.coins}
            </p>
            <p className="text-xs font-bold text-sundeep/80">Koin</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-sundeep" style={{ fontVariantNumeric: "tabular-nums" }}>
              ⭐ {totalStars}
            </p>
            <p className="text-xs font-bold text-sundeep/80">Bintang</p>
          </div>
        </motion.div>
      </div>

      {/* avatar shop */}
      <h2 className="mt-10 text-xl font-extrabold text-ink">Pilih Avatarmu</h2>
      <p className="text-sm text-inksoft">Kumpulkan koin dari bermain untuk membuka avatar baru!</p>
      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {AVATAR_SHOP.map((avatar) => {
          const owned = stats.unlockedAvatars.includes(avatar.emoji);
          const active = profile.avatar === avatar.emoji;
          return (
            <motion.button
              key={avatar.emoji}
              type="button"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => chooseAvatar(avatar.emoji, avatar.cost)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl p-3 shadow-md",
                active ? "bg-blush" : owned ? "bg-white" : "bg-white/60"
              )}
            >
              <span className={cn("text-4xl", !owned && "opacity-40 grayscale")}>{avatar.emoji}</span>
              <span className={cn("text-[10px] font-extrabold", active ? "text-ink" : "text-inksoft")}>
                {owned ? (active ? "dipakai" : "punya") : `🪙 ${avatar.cost}`}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* badges */}
      <h2 className="mt-10 text-xl font-extrabold text-ink">Lencana Dunia</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("rounded-2xl p-5 text-center", badge.earned ? "bg-sunsoft" : "bg-white/60")}
          >
            <span className={cn("text-5xl", !badge.earned && "opacity-30 grayscale")}>{badge.emoji}</span>
            <p className={cn("mt-2 font-extrabold", badge.earned ? "text-sundeep" : "text-inksoft")}>{badge.title}</p>
            <p className="text-xs text-inksoft" style={{ fontVariantNumeric: "tabular-nums" }}>
              {badge.done}/{badge.total} aktivitas
            </p>
          </motion.div>
        ))}
      </div>

      {/* achievements */}
      <h2 className="mt-10 text-xl font-extrabold text-ink">Pencapaian</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((achievement, i) => {
          const earned = stats.achievements.includes(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn("rounded-2xl p-4 text-center", earned ? "bg-mintsoft" : "bg-white/60")}
              title={achievement.description}
            >
              <span className={cn("text-3xl", !earned && "opacity-30 grayscale")}>{earned ? achievement.emoji : "❓"}</span>
              <p className={cn("mt-1 text-xs font-extrabold", earned ? "text-mintdeep" : "text-inksoft")}>
                {achievement.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-inksoft">{achievement.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link href="/perkembangan">
          <Button variant="secondary">📊 Lihat Perkembangan Belajarku</Button>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm("Hapus semua progres, XP, dan koin di perangkat ini?")) resetProgress();
          }}
        >
          🗑 Mulai dari awal
        </Button>
      </div>
    </div>
  );
}
