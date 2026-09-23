import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { Episode } from "@/data/podcasts";

const STORAGE_KEY = "weave-player-state";
const SPEED_KEY = "weave-podcast-speed";

interface StoredState {
  episodeId: string;
  positionSeconds: number;
}

export interface PlayerControls {
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
}

interface PlayerContextType {
  currentEpisode: Episode | null;
  queue: Episode[];
  hasNext: boolean;
  hasPrevious: boolean;
  resumePosition: number;
  shouldAutoplay: boolean;
  isExpanded: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  playerError: string | null;
  playbackSpeed: number;
  sleepTimerMinutes: number | "end" | null;
  sleepTimerEndsAt: number | null;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setPlayerError: (error: string | null) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setSleepTimer: (minutes: number | "end" | null) => void;
  cancelSleepTimer: () => void;
  playEpisode: (episode: Episode, queue?: Episode[]) => void;
  closePlayer: () => void;
  playNext: () => void;
  playPrevious: () => void;
  savePosition: (seconds: number) => void;
  restoreFromEpisodes: (episodes: Episode[]) => void;
  registerControls: (controls: PlayerControls | null) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [queue, setQueue] = useState<Episode[]>([]);
  const [resumePosition, setResumePosition] = useState(0);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const controlsRef = useRef<PlayerControls | null>(null);

  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem(SPEED_KEY);
    return saved ? parseFloat(saved) : 1;
  });
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | "end" | null>(null);
  const [sleepTimerEndsAt, setSleepTimerEndsAt] = useState<number | null>(null);

  const registerControls = useCallback((controls: PlayerControls | null) => {
    controlsRef.current = controls;
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.togglePlay();
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    try {
      localStorage.setItem(SPEED_KEY, speed.toString());
    } catch {}
  }, []);

  const setSleepTimer = useCallback((minutes: number | "end" | null) => {
    setSleepTimerMinutes(minutes);
    if (typeof minutes === "number") {
      setSleepTimerEndsAt(Date.now() + minutes * 60 * 1000);
    } else {
      setSleepTimerEndsAt(null);
    }
  }, []);

  const cancelSleepTimer = useCallback(() => {
    setSleepTimerMinutes(null);
    setSleepTimerEndsAt(null);
  }, []);

  const playEpisode = useCallback((episode: Episode, newQueue?: Episode[]) => {
    // If user clicks the currently active episode, toggle play/pause instead of restarting
    if (currentEpisode?.id === episode.id) {
      if (controlsRef.current) {
        controlsRef.current.togglePlay();
      } else {
        setIsPlaying((prev) => !prev);
      }
      return;
    }

    setCurrentEpisode(episode);
    setIsLoading(true);
    setIsPlaying(false);
    setPlayerError(null);
    if (newQueue) setQueue(newQueue);
    setResumePosition(0);
    setShouldAutoplay(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ episodeId: episode.id, positionSeconds: 0 }));
  }, [currentEpisode]);

  const closePlayer = useCallback(() => {
    setCurrentEpisode(null);
    setIsPlaying(false);
    setIsLoading(false);
    setPlayerError(null);
    setIsExpanded(false);
    setSleepTimerMinutes(null);
    setSleepTimerEndsAt(null);
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
        setShouldAutoplay(false);
      }
    } catch {}
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
        isExpanded,
        isPlaying,
        isLoading,
        playerError,
        playbackSpeed,
        sleepTimerMinutes,
        sleepTimerEndsAt,
        setIsExpanded,
        toggleExpanded,
        setIsPlaying,
        setIsLoading,
        setPlayerError,
        togglePlay,
        setPlaybackSpeed,
        setSleepTimer,
        cancelSleepTimer,
        playEpisode,
        closePlayer,
        playNext,
        playPrevious,
        savePosition,
        restoreFromEpisodes,
        registerControls,
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