import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Helper to parse hashtags from YouTube descriptions into Weave categories
function extractCategory(description: string): string {
  if (!description) return "Uncategorized";
  const desc = description.toLowerCase();
  if (desc.includes("#campuslife") || desc.includes("#campus")) return "Campus Life";
  if (desc.includes("#faith") || desc.includes("#community")) return "Faith & Community";
  if (desc.includes("#academics") || desc.includes("#academic")) return "Academics";
  if (desc.includes("#sports") || desc.includes("#recreation")) return "Sports & Recreation";
  if (desc.includes("#technology") || desc.includes("#tech")) return "Technology";
  if (desc.includes("#career") || desc.includes("#jobs")) return "Career";
  if (desc.includes("#entertainment")) return "Entertainment";
  if (desc.includes("#music")) return "Music";
  if (desc.includes("#entrepreneurship") || desc.includes("#business")) return "Entrepreneurship";
  if (desc.includes("#relationships")) return "Relationships";
  if (desc.includes("#events")) return "Events";
  if (desc.includes("#people")) return "People";
  return "Uncategorized";
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
      category: extractCategory(video.snippet.description || ""),
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