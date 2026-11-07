import { createClient } from "@supabase/supabase-js";

interface Env {
  SUPABASE_URL?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  CRON_SECRET?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_UPLOADS_PLAYLIST_ID?: string;
}

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

function formatDuration(isoDuration: string): string {
  if (!isoDuration) return "0:00";
  const regex = /P(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return "0:00";

  const days = parseInt(matches[1] || "0", 10);
  const hours = parseInt(matches[2] || "0", 10) + days * 24;
  const minutes = parseInt(matches[3] || "0", 10);
  const seconds = parseInt(matches[4] || "0", 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const authHeader = context.request.headers.get("authorization");
  if (!context.env.CRON_SECRET || authHeader !== `Bearer ${context.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const apiKey = context.env.YOUTUBE_API_KEY!;
    const playlistId = context.env.YOUTUBE_UPLOADS_PLAYLIST_ID!;

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=25&key=${apiKey}`
    );
    const playlistData = (await playlistRes.json()) as {
      items?: Array<{ snippet: { resourceId: { videoId: string } } }>;
    };

    if (!playlistData.items) {
      return Response.json(
        { error: "Failed to fetch playlist", detail: playlistData },
        { status: 500 }
      );
    }

    const videoIds = playlistData.items
      .map((item) => item.snippet.resourceId.videoId)
      .join(",");

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`
    );
    const videosData = (await videosRes.json()) as {
      items: Array<{
        id: string;
        snippet: {
          title: string;
          description?: string;
          publishedAt: string;
          thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
        };
        contentDetails: { duration: string };
      }>;
    };

    const episodes = videosData.items.map((video) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description?.slice(0, 500) || "",
      youtube_id: video.id,
      thumbnail:
        video.snippet.thumbnails?.high?.url ||
        video.snippet.thumbnails?.medium?.url ||
        `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
      duration: formatDuration(video.contentDetails.duration),
      category: extractCategory(video.snippet.description || ""),
      published_date: video.snippet.publishedAt.split("T")[0],
    }));

    const { error } = await supabase.from("episodes").upsert(episodes);

    if (error) {
      return Response.json({ error: "Supabase upsert failed", detail: error }, { status: 500 });
    }

    return Response.json({ synced: episodes.length }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Sync failed", detail: String(err) }, { status: 500 });
  }
};
