"use client";

import { useCallback, useEffect, useState } from "react";
import {
  xpForResult,
  coinsForResult,
  evaluateAchievements,
  FREE_AVATARS,
} from "@/utils/gamification";

/**
 * Child profile + play progress + gamification stats, stored in localStorage
 * (per device — no account needed for a TK child; see SRS privacy requirement).
 */

export interface ChildProfile {
  name: string;
  avatar: string;
  grade: "tk-a" | "tk-b";
}

export interface ProgressEntry {
  stars: number;
  correct: number;
  total: number;
  completedAt: string;
}

export type ProgressMap = Record<string, ProgressEntry>;

export interface ChildStats {
  xp: number;
  coins: number;
  plays: number;
  achievements: string[];
  unlockedAvatars: string[];
}

const PROFILE_KEY = "stem.profile";
const PROGRESS_KEY = "stem.progress";
const STATS_KEY = "stem.stats";

const DEFAULT_PROFILE: ChildProfile = { name: "", avatar: "🐱", grade: "tk-a" };
const DEFAULT_STATS: ChildStats = {
  xp: 0,
  coins: 0,
  plays: 0,
  achievements: [],
  unlockedAvatars: FREE_AVATARS,
};

/** Fired after every write so other hook instances (e.g. the Navbar) stay in sync. */
const SYNC_EVENT = "stem-store-updated";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function useChildProfile() {
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [stats, setStats] = useState<ChildStats>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      setProfile(readJson(PROFILE_KEY, DEFAULT_PROFILE));
      setProgress(readJson(PROGRESS_KEY, {}));
      setStats(readJson(STATS_KEY, DEFAULT_STATS));
      setIsLoaded(true);
    };
    load();
    // Same-page instances sync via SYNC_EVENT; other tabs via the storage event.
    window.addEventListener(SYNC_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(SYNC_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const saveProfile = useCallback((next: ChildProfile) => {
    setProfile(next);
    writeJson(PROFILE_KEY, next);
  }, []);

  /**
   * Records a finished activity: keeps the best attempt per activity,
   * always grants XP/coins for playing, and re-evaluates achievements.
   * localStorage is the source of truth and all computation happens here,
   * NOT inside setState updaters — updaters must stay pure (StrictMode
   * runs them twice, which would double-award XP).
   */
  const recordResult = useCallback((activitySlug: string, entry: ProgressEntry) => {
    const prevProgress = readJson<ProgressMap>(PROGRESS_KEY, {});
    const existing = prevProgress[activitySlug];
    const best = existing && existing.stars > entry.stars ? existing : entry;
    const nextProgress = { ...prevProgress, [activitySlug]: best };

    const prevStats = readJson(STATS_KEY, DEFAULT_STATS);
    const plays = prevStats.plays + 1;
    const totalStars = Object.values(nextProgress).reduce((sum, p) => sum + p.stars, 0);
    const nextStats: ChildStats = {
      ...prevStats,
      xp: prevStats.xp + xpForResult(entry.stars),
      coins: prevStats.coins + coinsForResult(entry.stars),
      plays,
      achievements: evaluateAchievements({ plays, totalStars, progress: nextProgress }, prevStats.achievements),
    };

    writeJson(PROGRESS_KEY, nextProgress);
    writeJson(STATS_KEY, nextStats);
    setProgress(nextProgress);
    setStats(nextStats);
  }, []);

  /** Buys an avatar with coins; returns false when coins are insufficient. */
  const unlockAvatar = useCallback((emoji: string, cost: number): boolean => {
    const current = readJson(STATS_KEY, DEFAULT_STATS);
    if (current.unlockedAvatars.includes(emoji)) return true;
    if (current.coins < cost) return false;

    const nextStats: ChildStats = {
      ...current,
      coins: current.coins - cost,
      unlockedAvatars: [...current.unlockedAvatars, emoji],
    };
    writeJson(STATS_KEY, nextStats);
    setStats(nextStats);
    return true;
  }, []);

  const resetProgress = useCallback(() => {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(STATS_KEY);
    setProgress({});
    setStats(DEFAULT_STATS);
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  const totalStars = Object.values(progress).reduce((sum, p) => sum + p.stars, 0);

  return {
    profile,
    saveProfile,
    progress,
    recordResult,
    stats,
    unlockAvatar,
    resetProgress,
    totalStars,
    isLoaded,
  };
}
