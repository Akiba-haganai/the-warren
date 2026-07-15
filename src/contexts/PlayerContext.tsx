import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Episode } from "@/data/podcasts";

const STORAGE_KEY = "warren-player-state";

interface StoredState {
  episodeId: string;
  positionSeconds: number;
}

interface PlayerContextType {
  currentEpisode: Episode | null;
  queue: Episode[];
  hasNext: boolean;
  hasPrevious: boolean;
  resumePosition: number;
  shouldAutoplay: boolean;
  playEpisode: (episode: Episode, queue?: Episode[]) => void;
  closePlayer: () => void;
  playNext: () => void;
  playPrevious: () => void;
  savePosition: (seconds: number) => void;
  restoreFromEpisodes: (episodes: Episode[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [queue, setQueue] = useState<Episode[]>([]);
  const [resumePosition, setResumePosition] = useState(0);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const playEpisode = useCallback((episode: Episode, newQueue?: Episode[]) => {
    setCurrentEpisode(episode);
    if (newQueue) setQueue(newQueue);
    setResumePosition(0);
    setShouldAutoplay(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ episodeId: episode.id, positionSeconds: 0 }));
  }, []);

  const closePlayer = useCallback(() => {
    setCurrentEpisode(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentIndex = currentEpisode ? queue.findIndex((e) => e.id === currentEpisode.id) : -1;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1;
  const hasPrevious = currentIndex > 0;

  const playNext = useCallback(() => {
    if (hasNext) {
      const next = queue[currentIndex + 1];
      setCurrentEpisode(next);
      setResumePosition(0);
      setShouldAutoplay(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ episodeId: next.id, positionSeconds: 0 }));
    }
  }, [hasNext, queue, currentIndex]);

  const playPrevious = useCallback(() => {
    if (hasPrevious) {
      const prev = queue[currentIndex - 1];
      setCurrentEpisode(prev);
      setResumePosition(0);
      setShouldAutoplay(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ episodeId: prev.id, positionSeconds: 0 }));
    }
  }, [hasPrevious, queue, currentIndex]);

  const savePosition = useCallback(
    (seconds: number) => {
      if (!currentEpisode) return;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ episodeId: currentEpisode.id, positionSeconds: seconds }),
      );
    },
    [currentEpisode],
  );

  const restoreFromEpisodes = useCallback((episodes: Episode[]) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: StoredState = JSON.parse(raw);
      const match = episodes.find((e) => e.id === parsed.episodeId);
      if (match) {
        setCurrentEpisode(match);
        setQueue(episodes);
        setResumePosition(parsed.positionSeconds || 0);
        setShouldAutoplay(false); // silent restore — don't force playback without a user gesture
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        queue,
        hasNext,
        hasPrevious,
        resumePosition,
        shouldAutoplay,
        playEpisode,
        closePlayer,
        playNext,
        playPrevious,
        savePosition,
        restoreFromEpisodes,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}