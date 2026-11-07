import { createClient } from "@supabase/supabase-js";

export interface Env {
  SUPABASE_URL?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  CRON_SECRET?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_UPLOADS_PLAYLIST_ID?: string;
  YOUTUBE_CHANNEL_ID?: string;
  [key: string]: unknown;
}

function extractCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("#technology") || text.includes("#tech") || text.includes("tech") || text.includes("coding") || text.includes("software")) return "Technology";
  if (text.includes("#faith") || text.includes("#community") || text.includes("faith") || text.includes("church") || text.includes("god")) return "Faith & Community";
  if (text.includes("#learning") || text.includes("#growth") || text.includes("education") || text.includes("study") || text.includes("learning")) return "Learning & Growth";
  if (text.includes("#sports") || text.includes("#recreation") || text.includes("sports") || text.includes("fitness") || text.includes("football") || text.includes("soccer")) return "Sports & Recreation";
  if (text.includes("#career") || text.includes("#jobs") || text.includes("career") || text.includes("job") || text.includes("internship")) return "Career";
  if (text.includes("#entrepreneurship") || text.includes("#business") || text.includes("business") || text.includes("hustle") || text.includes("startup") || text.includes("money")) return "Entrepreneurship";
  if (text.includes("#relationships") || text.includes("relationship") || text.includes("dating") || text.includes("friendship")) return "Relationships";
  if (text.includes("#events") || text.includes("event") || text.includes("conference") || text.includes("summit")) return "Events";
  if (text.includes("#people") || text.includes("interview") || text.includes("spotlight") || text.includes("story") || text.includes("guest")) return "People";
  if (text.includes("#music") || text.includes("music") || text.includes("song") || text.includes("artist")) return "Music";
  if (text.includes("#entertainment") || text.includes("entertainment") || text.includes("comedy")) return "Entertainment";
  return "Life & Culture";
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

export async function runYoutubeSync(env: Env): Promise<{ synced: number; total: number }> {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }

  const apiKey = env.YOUTUBE_API_KEY;
  let playlistId = env.YOUTUBE_UPLOADS_PLAYLIST_ID;

  // Auto-convert YouTube Channel ID (UC...) to Uploads Playlist ID (UU...)
  if (!playlistId && env.YOUTUBE_CHANNEL_ID) {
    playlistId = env.YOUTUBE_CHANNEL_ID.trim().replace(/^UC/, "UU");
  }

  // Fallback to channel ID UUGKgsxYNTUESqdvySiMIQ1A if not provided in env
  if (!playlistId) {
    playlistId = "UUGKgsxYNTUESqdvySiMIQ1A";
  }

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch all playlist items with pagination (up to 200 episodes)
  let pageToken: string | undefined = undefined;
  const allVideoIds: string[] = [];
  let pageCount = 0;

  do {
    const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(
      playlistId
    )}&maxResults=50${pageParam}&key=${apiKey}`;

    const playlistRes = await fetch(playlistUrl);
    if (!playlistRes.ok) {
      const errText = await playlistRes.text();
      throw new Error(`YouTube playlistItems API error (${playlistRes.status}): ${errText}`);
    }

    const playlistData = (await playlistRes.json()) as {
      nextPageToken?: string;
      items?: Array<{
        snippet?: {
          title?: string;
          resourceId?: { videoId?: string };
        };
      }>;
    };

    if (playlistData.items && playlistData.items.length > 0) {
      for (const item of playlistData.items) {
        const vid = item.snippet?.resourceId?.videoId;
        const title = item.snippet?.title || "";
        // Exclude deleted or private videos
        if (vid && title !== "Private video" && title !== "Deleted video") {
          allVideoIds.push(vid);
        }
      }
    }

    pageToken = playlistData.nextPageToken;
    pageCount++;
  } while (pageToken && allVideoIds.length < 200 && pageCount < 5);

  if (allVideoIds.length === 0) {
    return { synced: 0, total: 0 };
  }

  // 2. Fetch full video details (duration, high-res thumbnail, description) in chunks of 50
  const allEpisodes: Array<{
    id: string;
    title: string;
    description: string;
    youtube_id: string;
    thumbnail: string;
    duration: string;
    category: string;
    published_date: string;
  }> = [];

  for (let i = 0; i < allVideoIds.length; i += 50) {
    const batch = allVideoIds.slice(i, i + 50);
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batch.join(
      ","
    )}&key=${apiKey}`;

    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) {
      const errText = await videosRes.text();
      throw new Error(`YouTube videos API error (${videosRes.status}): ${errText}`);
    }

    const videosData = (await videosRes.json()) as {
      items?: Array<{
        id: string;
        snippet: {
          title: string;
          description?: string;
          publishedAt: string;
          thumbnails?: {
            maxres?: { url?: string };
            standard?: { url?: string };
            high?: { url?: string };
            medium?: { url?: string };
          };
        };
        contentDetails: { duration: string };
      }>;
    };

    if (videosData.items) {
      for (const video of videosData.items) {
        allEpisodes.push({
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description?.slice(0, 500) || "",
          youtube_id: video.id,
          thumbnail:
            video.snippet.thumbnails?.maxres?.url ||
            video.snippet.thumbnails?.standard?.url ||
            video.snippet.thumbnails?.high?.url ||
            video.snippet.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
          duration: formatDuration(video.contentDetails.duration),
          category: extractCategory(video.snippet.title, video.snippet.description || ""),
          published_date: video.snippet.publishedAt.split("T")[0],
        });
      }
    }
  }

  // 3. Upsert episodes into Supabase
  const { error: upsertErr } = await supabase.from("episodes").upsert(allEpisodes, {
    onConflict: "id",
  });

  if (upsertErr) {
    throw new Error(`Supabase upsert failed: ${upsertErr.message}`);
  }

  return { synced: allEpisodes.length, total: allVideoIds.length };
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const authHeader = context.request.headers.get("authorization");
  if (!context.env.CRON_SECRET || authHeader !== `Bearer ${context.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runYoutubeSync(context.env);
    return Response.json(result, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("YouTube sync failure:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
};
