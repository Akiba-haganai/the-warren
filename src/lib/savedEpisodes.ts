// src/lib/savedEpisodes.ts
import type { Episode } from "@/data/podcasts";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "weave-saved-episodes-map";

export function getSavedEpisodesMap(): Record<string, Episode> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useSavedEpisodes() {
  const [savedMap, setSavedMap] = useState<Record<string, Episode>>(getSavedEpisodesMap);

  useEffect(() => {
    setSavedMap(getSavedEpisodesMap());
  }, []);

  const toggleSaveEpisode = useCallback((episode: Episode) => {
    const current = getSavedEpisodesMap();
    const isCurrentlySaved = Boolean(current[episode.id]);

    if (isCurrentlySaved) {
      delete current[episode.id];
      toast("Removed episode from Bookmarks");
    } else {
      current[episode.id] = episode;
      toast.success("Saved episode to Bookmarks!");
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}

    setSavedMap({ ...current });

    // Sync to Supabase if logged in
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && supabase) {
          if (isCurrentlySaved) {
            supabase
              .from("user_saved_episodes")
              .delete()
              .eq("user_id", session.user.id)
              .eq("episode_id", episode.id)
              .then();
          } else {
            supabase
              .from("user_saved_episodes")
              .upsert({
                user_id: session.user.id,
                episode_id: episode.id,
                created_at: new Date().toISOString(),
              })
              .then();
          }
        }
      });
    }
  }, []);

  return {
    savedMap,
    savedIds: Object.keys(savedMap),
    toggleSaveEpisode,
    isSaved: (id: string) => Boolean(savedMap[id]),
  };
}
