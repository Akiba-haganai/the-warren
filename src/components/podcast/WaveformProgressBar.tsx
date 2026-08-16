// src/components/podcast/WaveformProgressBar.tsx
import { useMemo, useRef } from "react";

interface WaveformProgressBarProps {
  episodeId: string;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  barCount?: number;
}

function generateHeights(seed: string, count: number): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const pseudo = Math.abs(Math.sin(hash + i * 999));
    heights.push(Math.floor(25 + pseudo * 75)); // 25% to 100% height
  }
  return heights;
}

export function WaveformProgressBar({
  episodeId,
  currentTime,
  duration,
  onSeek,
  barCount = 36,
}: WaveformProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barHeights = useMemo(() => generateHeights(episodeId, barCount), [episodeId, barCount]);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const activeBarIndex = Math.floor((progressPercent / 100) * barCount);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickPercent * duration);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="w-full h-12 flex items-center justify-between gap-1 cursor-pointer group py-1"
      role="slider"
      aria-label="Waveform Seek Bar"
      aria-valuenow={Math.round(currentTime)}
      aria-valuemax={Math.round(duration)}
    >
      {barHeights.map((h, i) => {
        const isPlayed = i <= activeBarIndex;
        return (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={`w-1 rounded-full transition-all duration-150 group-hover:opacity-100 ${
              isPlayed ? "bg-[#FF6D00] shadow-sm shadow-orange-500/50" : "bg-muted-foreground/30"
            }`}
          />
        );
      })}
    </div>
  );
}
