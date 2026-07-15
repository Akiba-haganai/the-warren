import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Converts YouTube's ISO 8601 duration (e.g. "PT18M24S") to "18:24"
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Guard: only Vercel Cron (or you, manually, with the secret) can trigger this
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY!;
    const playlistId = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID!;

    // Step 1: get video IDs from the uploads playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=25&key=${apiKey}`,
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items) {
      return res.status(500).json({ error: "Failed to fetch playlist", detail: playlistData });
    }

    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    // Step 2: get duration + full details for those videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`,
    );
    const videosData = await videosRes.json();

    const episodes = videosData.items.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description?.slice(0, 500) || "",
      youtube_id: video.id,
      thumbnail:
        video.snippet.thumbnails?.maxres?.url ||
        video.snippet.thumbnails?.high?.url ||
        `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      duration: formatDuration(video.contentDetails.duration),
      category: "Uncategorized", // no reliable category from YouTube; see note below
      published_date: video.snippet.publishedAt.split("T")[0],
    }));

    const { error } = await supabase.from("episodes").upsert(episodes);

    if (error) {
      return res.status(500).json({ error: "Supabase upsert failed", detail: error });
    }

    return res.status(200).json({ synced: episodes.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sync failed", detail: String(err) });
  }
}