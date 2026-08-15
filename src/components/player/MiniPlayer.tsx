// src/components/player/MiniPlayer.tsx
import YouTube from "react-youtube";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PodcastShareModal } from "@/components/podcast/PodcastShareModal";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const {
    currentEpisode,
    closePlayer,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious,
    resumePosition,
    savePosition,
    isExpanded,
    setIsExpanded,
    toggleExpanded,
  } = usePlayer();

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
        // Video ended, auto-advance
        playNext();
      }
    },
    [hasNext, playNext],
  );

  // Poll playback position for seek bar + periodic localStorage save
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

  const skipSeconds = (seconds: number) => {
    if (!player) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  if (!currentEpisode) return null;

  return (
    <>
      {/* ── EXPANDED PLAYER OVERLAY ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground"
                aria-label="Collapse player"
              >
                <ChevronDown className="h-6 w-6" />
              </Button>

              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-semibold tracking-wider text-primary">
                  Weave Podcasts
                </span>
                <span className="text-xs text-muted-foreground">Now Playing</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closePlayer}
                className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground"
                aria-label="Close player"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Center Content: Large Art & Episode Details */}
            <div className="my-auto py-6 flex flex-col items-center max-w-md mx-auto w-full">
              <motion.img
                layoutId="podcast-cover-art"
                src={currentEpisode.thumbnail}
                alt={currentEpisode.title}
                className="w-full aspect-video sm:aspect-square object-cover rounded-2xl shadow-2xl border border-border"
              />

              <div className="mt-6 text-center w-full px-2">
                <Badge variant="secondary" className="mb-2">
                  {currentEpisode.category}
                </Badge>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight line-clamp-2">
                  {currentEpisode.title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Published on {currentEpisode.date}
                </p>
                {currentEpisode.description && (
                  <p className="mt-3 text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                    {currentEpisode.description}
                  </p>
                )}
              </div>

              {/* Progress & Scrubbing Bar */}
              <div className="w-full mt-6">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 accent-primary bg-muted rounded-lg cursor-pointer"
                  aria-label="Seek time"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
                  disabled={!hasPrevious}
                  onClick={playPrevious}
                  aria-label="Previous Episode"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => skipSeconds(-15)}
                  aria-label="Rewind 15 seconds"
                  title="Rewind 15s"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                <Button
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full bg-[#FF6D00] hover:bg-orange-600 text-white shadow-glow-coral flex items-center justify-center transition-transform active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 fill-white" />
                  ) : (
                    <Play className="h-7 w-7 fill-white ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => skipSeconds(15)}
                  aria-label="Forward 15 seconds"
                  title="Forward 15s"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
                  disabled={!hasNext}
                  onClick={playNext}
                  aria-label="Next Episode"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/40">
              <PodcastShareModal episode={currentEpisode} />
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 text-xs"
                asChild
              >
                <a
                  href={`https://www.youtube.com/watch?v=${currentEpisode.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in YouTube
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DOCKED MINI PLAYER ── */}
      {!isExpanded && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl transition-all">
          {/* Progress bar at top edge */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 accent-primary cursor-pointer block"
            aria-label="Seek"
          />

          <div className="p-3 flex items-center gap-3">
            {/* Clickable thumbnail + info to expand */}
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-3 flex-1 min-w-0 text-left group"
              aria-label="Expand player"
            >
              <motion.img
                layoutId="podcast-cover-art"
                src={currentEpisode.thumbnail}
                alt={currentEpisode.title}
                className="h-12 w-20 object-cover rounded-lg shrink-0 border border-border group-hover:opacity-90 transition"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition">
                    {currentEpisode.title}
                  </p>
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            </button>

            {/* Quick Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
                disabled={!hasPrevious}
                onClick={playPrevious}
                aria-label="Previous episode"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-primary" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
                disabled={!hasNext}
                onClick={playNext}
                aria-label="Next episode"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <PodcastShareModal episode={currentEpisode} />

              <Button
                variant="ghost"
                size="icon"
                onClick={closePlayer}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden YouTube IFrame */}
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
    </>
  );
}