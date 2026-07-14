import YouTube from "react-youtube";
import { usePlayer } from "@/contexts/PlayerContext";
import { X, Play, Pause, SkipForward, SkipBack, Maximize2 } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function MiniPlayer() {
  const { currentEpisode, closePlayer } = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  const onReady = useCallback((event: { target: any }) => {
    setPlayer(event.target);
    event.target.playVideo();
    setIsPlaying(true);
  }, []);

  const onStateChange = useCallback((event: { data: number }) => {
    setIsPlaying(event.data === 1); // 1 = playing
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
  };

  if (!currentEpisode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant p-3 flex items-center gap-3 transition-all">
      {/* Thumbnail */}
      <img
        src={currentEpisode.thumbnail}
        alt={currentEpisode.title}
        className="h-12 w-20 object-cover rounded-md"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{currentEpisode.title}</p>
        <p className="text-xs text-muted-foreground">Warren Podcasts</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={closePlayer} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden YouTube iframe (plays audio only) */}
      <div className="hidden">
        <YouTube
          videoId={currentEpisode.youtubeId}
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
    </div>
  );
}