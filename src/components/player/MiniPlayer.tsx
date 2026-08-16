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
  Gauge,
  Moon,
} from "lucide-react";
import { Bookmark } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PodcastShareModal } from "@/components/podcast/PodcastShareModal";
import { saveEpisodeProgress } from "@/lib/podcastProgress";
import { useSavedEpisodes } from "@/lib/savedEpisodes";
import { extractDominantColor } from "@/lib/colorExtractor";
import { WaveformProgressBar } from "@/components/podcast/WaveformProgressBar";
import { PodcastComments } from "@/components/podcast/PodcastComments";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_OPTIONS: { label: string; value: number | "end" | null }[] = [
  { label: "Off", value: null },
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
  { label: "End of episode", value: "end" },
];

export function MiniPlayer() {
  const {
    currentEpisode,
    queue,
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
    playbackSpeed,
    setPlaybackSpeed,
    sleepTimerMinutes,
    sleepTimerEndsAt,
    setSleepTimer,
    cancelSleepTimer,
  } = usePlayer();

  const { toggleSaveEpisode, isSaved } = useSavedEpisodes();

  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sleepRemainingSec, setSleepRemainingSec] = useState<number | null>(null);
  const [tintColor, setTintColor] = useState<string>("rgba(255, 109, 0, 0.15)");

  // Extract cover art dominant color tint for Phase 7
  useEffect(() => {
    if (currentEpisode) {
      extractDominantColor(currentEpisode.thumbnail, currentEpisode.id).then(setTintColor);
    }
  }, [currentEpisode]);

  const pollRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const onReady = useCallback(
    (event: { target: any }) => {
      setPlayer(event.target);
      if (resumePosition > 0) {
        event.target.seekTo(resumePosition, true);
      }
      try {
        event.target.setPlaybackRate(playbackSpeed);
      } catch {}
      event.target.playVideo();
      setIsPlaying(true);
      setDuration(event.target.getDuration());
    },
    [resumePosition, playbackSpeed],
  );

  // Sync playback speed whenever user changes it
  useEffect(() => {
    if (player && player.setPlaybackRate) {
      try {
        player.setPlaybackRate(playbackSpeed);
      } catch {}
    }
  }, [player, playbackSpeed]);

  // Sleep timer countdown & audio fade-out
  useEffect(() => {
    if (!sleepTimerEndsAt || !player || !isPlaying) {
      setSleepRemainingSec(null);
      return;
    }

    const timer = window.setInterval(() => {
      const remainingMs = sleepTimerEndsAt - Date.now();
      const remSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setSleepRemainingSec(remSec);

      // Fade volume down in the last 5 seconds
      if (remainingMs <= 5000 && remainingMs > 0) {
        try {
          const fadeVol = Math.max(0, Math.floor((remainingMs / 5000) * 100));
          player.setVolume(fadeVol);
        } catch {}
      }

      if (remainingMs <= 0) {
        try {
          player.pauseVideo();
          player.setVolume(100);
        } catch {}
        cancelSleepTimer();
        toast("Sleep timer finished — playback paused");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerEndsAt, player, isPlaying, cancelSleepTimer]);

  const onStateChange = useCallback(
    (event: { data: number }) => {
      setIsPlaying(event.data === 1);

      // Video ended
      if (event.data === 0) {
        if (sleepTimerMinutes === "end") {
          cancelSleepTimer();
          toast("Sleep timer finished — playback ended");
          return;
        }

        if (hasNext) {
          const currentIndex = currentEpisode ? queue.findIndex((e) => e.id === currentEpisode.id) : -1;
          const nextEpisode = queue[currentIndex + 1];

          if (nextEpisode) {
            const toastId = toast(`Up next: ${nextEpisode.title}`, {
              duration: 5000,
              action: {
                label: "Cancel",
                onClick: () => {
                  if (autoAdvanceTimeoutRef.current) {
                    clearTimeout(autoAdvanceTimeoutRef.current);
                    autoAdvanceTimeoutRef.current = null;
                  }
                  toast.dismiss(toastId);
                },
              },
            });

            autoAdvanceTimeoutRef.current = window.setTimeout(() => {
              playNext();
            }, 5000);
          }
        }
      }
    },
    [hasNext, playNext, currentEpisode, queue, sleepTimerMinutes, cancelSleepTimer],
  );

  // Poll playback position for seek bar + throttled progress save (every 10s)
  const lastSaveRef = useRef<number>(0);
  useEffect(() => {
    if (!player || !isPlaying || !currentEpisode) return;
    pollRef.current = window.setInterval(() => {
      const t = player.getCurrentTime?.() ?? 0;
      const d = player.getDuration?.() ?? duration;
      setCurrentTime(t);
      savePosition(t);

      // Throttle database / progress saves to every 10 seconds
      const now = Date.now();
      if (now - lastSaveRef.current > 10_000) {
        lastSaveRef.current = now;
        saveEpisodeProgress(currentEpisode.id, t, d);
      }
    }, 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [player, isPlaying, currentEpisode, duration, savePosition]);

  // Phase 4 — Media Session API for Lock Screen Controls
  useEffect(() => {
    if (!currentEpisode || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentEpisode.title,
        artist: "Weave",
        album: "Weave Podcasts",
        artwork: [
          { src: currentEpisode.thumbnail, sizes: "512x512", type: "image/jpeg" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      });

      const actionHandlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
        ["play", () => player?.playVideo()],
        ["pause", () => player?.pauseVideo()],
        ["previoustrack", () => hasPrevious && playPrevious()],
        ["nexttrack", () => hasNext && playNext()],
        ["seekbackward", () => skipSeconds(-15)],
        ["seekforward", () => skipSeconds(15)],
        ["stop", () => closePlayer()],
      ];

      for (const [action, handler] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch {}
      }
    } catch {}
  }, [currentEpisode, player, hasPrevious, hasNext, playPrevious, playNext, closePlayer]);

  // Sync position state with Media Session
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      "mediaSession" in navigator &&
      "setPositionState" in navigator.mediaSession &&
      duration > 0
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(1, duration),
          playbackRate: playbackSpeed || 1,
          position: Math.min(currentTime, duration),
        });
      } catch {}
    }
  }, [currentTime, duration, playbackSpeed]);

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
            style={{
              background: `radial-gradient(circle at 50% 20%, ${tintColor} 0%, rgba(15, 15, 18, 0.98) 80%)`,
            }}
            className="fixed inset-0 z-50 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto text-foreground"
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

                {/* Sleep Timer Indicator Pill */}
                {(sleepRemainingSec !== null || sleepTimerMinutes === "end") && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                    <Moon className="h-3.5 w-3.5" />
                    <span>
                      {sleepTimerMinutes === "end"
                        ? "Pauses at end of episode"
                        : `Sleep timer: ${formatTime(sleepRemainingSec || 0)}`}
                    </span>
                    <button
                      onClick={cancelSleepTimer}
                      className="ml-1 hover:text-foreground text-xs"
                      title="Cancel timer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {currentEpisode.description && (
                  <p className="mt-3 text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                    {currentEpisode.description}
                  </p>
                )}
              </div>

              {/* Waveform Progress & Scrubbing Bar (Phase 7) */}
              <div className="w-full mt-6">
                <WaveformProgressBar
                  episodeId={currentEpisode.id}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={(t) => {
                    player?.seekTo(t, true);
                    setCurrentTime(t);
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
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

            {/* Bottom Actions Row: Speed Selector, Sleep Timer, Share, YouTube Link */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 pt-4 border-t border-border/40">
              {/* Speed Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                    <Gauge className="h-3.5 w-3.5" />
                    <span>{playbackSpeed}x</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {SPEED_OPTIONS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={playbackSpeed === speed ? "font-bold text-primary" : ""}
                    >
                      {speed}x {playbackSpeed === speed ? "✓" : ""}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sleep Timer Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={sleepTimerMinutes !== null ? "default" : "outline"}
                    size="sm"
                    className="rounded-full gap-1.5 text-xs"
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>{sleepTimerMinutes !== null ? "Timer Active" : "Sleep Timer"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {SLEEP_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.label}
                      onClick={() => setSleepTimer(opt.value)}
                      className={sleepTimerMinutes === opt.value ? "font-bold text-primary" : ""}
                    >
                      {opt.label} {sleepTimerMinutes === opt.value ? "✓" : ""}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bookmark / Save Episode */}
              <Button
                variant={isSaved(currentEpisode.id) ? "default" : "outline"}
                size="sm"
                className="rounded-full gap-1.5 text-xs"
                onClick={() => toggleSaveEpisode(currentEpisode)}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved(currentEpisode.id) ? "fill-white" : ""}`} />
                <span>{isSaved(currentEpisode.id) ? "Saved" : "Save"}</span>
              </Button>

              <PodcastShareModal episode={currentEpisode} />

              <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs" asChild>
                <a
                  href={`https://www.youtube.com/watch?v=${currentEpisode.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in YouTube
                </a>
              </Button>
            </div>

            {/* Timestamped Comments (Phase 8) */}
            <div className="max-w-md mx-auto w-full">
              <PodcastComments
                episodeId={currentEpisode.id}
                currentTime={currentTime}
                onSeek={(t) => {
                  player?.seekTo(t, true);
                  setCurrentTime(t);
                }}
              />
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  {sleepRemainingSec !== null && (
                    <span className="text-primary font-medium flex items-center gap-0.5">
                      <Moon className="h-3 w-3" /> {formatTime(sleepRemainingSec)}
                    </span>
                  )}
                </div>
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