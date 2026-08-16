// src/lib/podcastProgress.ts
import { supabase } from "@/lib/supabase";

export interface EpisodeProgress {
  episodeId: string;
  positionSeconds: number;
  durationSeconds: number;
  progressPercent: number; // 0 to 100
  updatedAt: number;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = "weave-podcast-progress-map";

export function getLocalProgressMap(): Record<string, EpisodeProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEpisodeProgress(
  episodeId: string,
  positionSeconds: number,
  durationSeconds: number,
) {
  if (!episodeId || !durationSeconds || durationSeconds <= 0) return;

  const percent = Math.min(100, Math.max(0, (positionSeconds / durationSeconds) * 100));
  const completed = percent >= 95;

  const entry: EpisodeProgress = {
    episodeId,
    positionSeconds: Math.floor(positionSeconds),
    durationSeconds: Math.floor(durationSeconds),
    progressPercent: Math.round(percent),
    updatedAt: Date.now(),
    completed,
  };

  // 1. Save to LocalStorage
  const map = getLocalProgressMap();
  map[episodeId] = entry;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
  } catch {}

  // 2. Sync to Supabase if user is logged in
  try {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("user_episode_progress")
          .upsert({
            user_id: session.user.id,
            episode_id: episodeId,
            position_seconds: Math.floor(positionSeconds),
            duration_seconds: Math.floor(durationSeconds),
            completed,
            updated_at: new Date().toISOString(),
          })
          .then();
      }
    });
  } catch {}
}

export function getInProgressEpisodes(progressMap: Record<string, EpisodeProgress>): Record<string, EpisodeProgress> {
  const inProgress: Record<string, EpisodeProgress> = {};
  for (const [id, entry] of Object.entries(progressMap)) {
    if (entry.progressPercent >= 5 && entry.progressPercent < 95 && !entry.completed) {
      inProgress[id] = entry;
    }
  }
  return inProgress;
}
