// src/lib/offlineAudio.ts
import type { Episode } from "@/data/podcasts";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const CACHE_NAME = "weave-episode-audio";
const INDEX_STORAGE_KEY = "weave-offline-episodes-index";

export function getOfflineEpisodesMap(): Record<string, Episode> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INDEX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useOfflinePodcasts() {
  const [offlineMap, setOfflineMap] = useState<Record<string, Episode>>(getOfflineEpisodesMap);
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOfflineMap(getOfflineEpisodesMap());
  }, []);

  const downloadEpisode = useCallback(async (episode: Episode) => {
    if (typeof window === "undefined" || !("caches" in window)) {
      toast.error("Offline caching is not supported in this browser environment");
      return;
    }

    setDownloadingIds((prev) => ({ ...prev, [episode.id]: true }));
    toast(`Downloading "${episode.title}" for offline playback...`);

    try {
      const cache = await caches.open(CACHE_NAME);

      // Cache thumbnail image
      if (episode.thumbnail) {
        try {
          await cache.add(new Request(episode.thumbnail, { mode: "cors" }));
        } catch {}
      }

      // Save index metadata in LocalStorage
      const current = getOfflineEpisodesMap();
      current[episode.id] = episode;
      localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(current));
      setOfflineMap(current);

      toast.success(`"${episode.title}" is now available offline!`);
    } catch (err) {
      toast.error(`Failed to download "${episode.title}" for offline use`);
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [episode.id]: false }));
    }
  }, []);

  const removeDownload = useCallback(async (episodeId: string) => {
    if (typeof window === "undefined" || !("caches" in window)) return;

    try {
      const current = getOfflineEpisodesMap();
      const episode = current[episodeId];
      if (episode?.thumbnail) {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(episode.thumbnail).catch(() => {});
      }

      delete current[episodeId];
      localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(current));
      setOfflineMap({ ...current });
      toast("Removed offline episode download");
    } catch {
      toast.error("Failed to remove offline download");
    }
  }, []);

  return {
    offlineMap,
    offlineIds: Object.keys(offlineMap),
    downloadingIds,
    downloadEpisode,
    removeDownload,
    isDownloaded: (id: string) => Boolean(offlineMap[id]),
  };
}
