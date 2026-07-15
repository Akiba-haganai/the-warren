// src/components/player/MiniPlayer.tsx
import YouTube from "react-youtube";
import { usePlayer } from "@/contexts/PlayerContext";
import { X, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const { currentEpisode, closePlayer, hasNext, hasPrevious, playNext, playPrevious, resumePosition, savePosition } =
    usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const pollRef = useRef<number | null>(null);

  const onReady = useCallback(
    (event: { target: any }) => {
      setPlayer(event.target);
      if (resumePosition > 0) {
        event.target.seekTo(resumePosition, true);
      }
      event.target.playVideo();
      setIsPlaying(true);
      setDuration(event.target.getDuration());
    },
    [resumePosition],
  );

  const onStateChange = useCallback(
    (event: { data: number }) => {
      setIsPlaying(event.data === 1);
      if (event.data === 0 && hasNext) {
        // video ended, auto-advance
        playNext();
      }
    },
    [hasNext, playNext],
  );

  // Poll playback position for the seek bar + periodic localStorage save
  useEffect(() => {
    if (!player || !isPlaying) return;
    pollRef.current = window.setInterval(() => {
      const t = player.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
      savePosition(t);
    }, 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [player, isPlaying, savePosition]);

  const togglePlay = () => {
    if (isPlaying) player?.pauseVideo();
    else player?.playVideo();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    player?.seekTo(t, true);
    setCurrentTime(t);
  };

  if (!currentEpisode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant transition-all">
      {/* Seek bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-1 accent-primary cursor-pointer"
        aria-label="Seek"
      />

      <div className="p-3 flex items-center gap-3">
        <img
          src={currentEpisode.thumbnail}
          alt={currentEpisode.title}
          className="h-12 w-20 object-cover rounded-md shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentEpisode.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!hasPrevious}
            onClick={playPrevious}
            aria-label="Previous episode"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!hasNext}
            onClick={playNext}
            aria-label="Next episode"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={closePlayer} className="h-8 w-8" aria-label="Close player">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden">
        <YouTube
          videoId={currentEpisode.youtubeId}
          opts={{
            height: "0",
            width: "0",
            playerVars: { autoplay: 1, controls: 0, modestbranding: 1, playsinline: 1 },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
    </div>
  );
}