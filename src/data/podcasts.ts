export interface Episode {
  id: string;
  title: string;
  description: string;
  youtubeId: string;      // YouTube video ID
  thumbnail: string;      // high‑quality thumbnail URL
  duration: string;       // e.g. "12:34"
  category: string;
  date: string;
}

// Default to empty array — live episodes are synced directly from YouTube to Supabase
export const episodes: Episode[] = [];
