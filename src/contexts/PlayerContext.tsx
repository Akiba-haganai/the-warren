import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PlayerContextType {
  currentEpisode: Episode | null;
  playEpisode: (episode: Episode) => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  const playEpisode = useCallback((episode: Episode) => {
    setCurrentEpisode(episode);
  }, []);

  const closePlayer = useCallback(() => {
    setCurrentEpisode(null);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentEpisode, playEpisode, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}