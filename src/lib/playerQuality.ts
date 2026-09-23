export type VideoQuality = "default" | "hd720" | "medium" | "small" | "tiny";

export interface QualityOption {
  label: string;
  resolution: string;
  value: VideoQuality;
  description: string;
}

export const QUALITY_OPTIONS: QualityOption[] = [
  { label: "Auto", resolution: "Auto", value: "default", description: "Network dependent" },
  { label: "HD", resolution: "720p", value: "hd720", description: "High data usage" },
  { label: "Standard", resolution: "360p", value: "medium", description: "Balanced — Recommended" },
  { label: "Data Saver", resolution: "240p", value: "small", description: "Low data usage" },
  { label: "Ultra Low", resolution: "144p", value: "tiny", description: "Minimum bandwidth" },
];

const QUALITY_STORAGE_KEY = "weave_video_quality";

export function getStoredQuality(): VideoQuality {
  if (typeof window === "undefined") return "medium";
  try {
    const val = localStorage.getItem(QUALITY_STORAGE_KEY) as VideoQuality | null;
    if (val && QUALITY_OPTIONS.some((opt) => opt.value === val)) {
      return val;
    }
  } catch {}
  return "medium"; // Default to 360p on mobile to prevent buffer stalls
}

export function setStoredQuality(quality: VideoQuality) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUALITY_STORAGE_KEY, quality);
  } catch {}
}
