import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface Env {
  VITE_SANITY_PROJECT_ID?: string;
  VITE_SANITY_DATASET?: string;
  SUPABASE_URL?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  [key: string]: unknown;
}

export interface OgMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
}

function sanitizeDataset(val?: string | null): string {
  if (!val) return "production";
  const cleaned = val.replace(/['"]/g, "").trim().toLowerCase();
  if (/^~?[a-z0-9_-]+$/.test(cleaned) && cleaned.length <= 64) {
    return cleaned;
  }
  return "production";
}

function sanitizeProjectId(val?: string | null): string {
  if (!val) return "7yislksr";
  const cleaned = val.replace(/['"]/g, "").trim().toLowerCase();
  if (/^[a-z0-9-]+$/.test(cleaned) && cleaned.length <= 64) {
    return cleaned;
  }
  return "7yislksr";
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildHtml({
  title,
  description,
  image,
  url,
  type = "article",
}: OgMetadata) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(url);
  const safeType = escapeHtml(type);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle} — Weave</title>
  <meta name="description" content="${safeDesc}">
  <meta property="og:site_name" content="Weave">
  <meta property="og:type" content="${safeType}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:url" content="${safeUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
</head>
<body>
  <p>Redirecting to <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;
}

/**
 * Replaces the generic Open Graph and Twitter meta tags in index.html
 * so both social crawlers (regardless of User-Agent) and human browsers
 * receive the specific episode or article thumbnail and title.
 */
export function injectOgIntoHtml(html: string, meta: OgMetadata): string {
  const safeTitle = escapeHtml(`${meta.title} — Weave`);
  const safeDesc = escapeHtml(meta.description);
  const safeImage = escapeHtml(meta.image);
  const safeUrl = escapeHtml(meta.url);

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${safeImage}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${safeUrl}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${safeImage}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${safeUrl}" />`
    );
}

export async function resolveStoryOg(
  slug: string,
  baseUrl: string,
  env: Env
): Promise<OgMetadata> {
  const projectId = sanitizeProjectId(env.VITE_SANITY_PROJECT_ID);
  const dataset = sanitizeDataset(env.VITE_SANITY_DATASET);

  const sanity = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  const builder = imageUrlBuilder(sanity);

  function getSanityImageUrl(mainImage: unknown) {
    if (!mainImage) return null;
    try {
      return builder.image(mainImage).width(1200).url();
    } catch {
      return null;
    }
  }

  try {
    const story = await sanity.fetch(
      `*[_type == "story" && slug.current == $slug][0]{
        title,
        excerpt,
        mainImage
      }`,
      { slug }
    );

    if (story?.title) {
      return {
        title: story.title,
        description: story.excerpt || "Read this story on Weave.",
        image: getSanityImageUrl(story.mainImage) || `${baseUrl}/og-image-1200x630.png`,
        url: `${baseUrl}/blogs/${slug}`,
        type: "article",
      };
    }
  } catch (err) {
    console.error("Failed to fetch story OG metadata:", err);
  }

  return {
    title: "Weave — Stories, Podcasts & Culture",
    description: "Discover stories, podcasts, and culture for everyone.",
    image: `${baseUrl}/og-image-1200x630.png`,
    url: `${baseUrl}/blogs/${slug}`,
    type: "website",
  };
}

export async function resolveEpisodeOg(
  episodeId: string,
  baseUrl: string,
  env: Env
): Promise<OgMetadata> {
  const cleanId = episodeId.trim();
  const targetUrl = `${baseUrl}/podcasts?episode=${encodeURIComponent(cleanId)}`;
  // Reliable YouTube high-quality 16:9 thumbnail that always exists for every public video
  const defaultYtThumb = `https://i.ytimg.com/vi/${encodeURIComponent(cleanId)}/hqdefault.jpg`;

  // 1. Try Supabase episodes table first
  const supabaseUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || "https://otdeonkfwghuevzhxrsy.supabase.co").trim();
  const supabaseKey = (env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || "").trim();

  if (supabaseUrl && supabaseKey && !supabaseKey.startsWith("<")) {
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
      const { data: ep } = await supabase
        .from("episodes")
        .select("id, title, description, thumbnail, youtube_id")
        .or(`id.eq.${cleanId},youtube_id.eq.${cleanId}`)
        .limit(1)
        .maybeSingle();

      if (ep?.title) {
        return {
          title: ep.title,
          description: ep.description
            ? ep.description.slice(0, 200)
            : "Listen to this podcast episode on Weave.",
          image: ep.thumbnail || `https://i.ytimg.com/vi/${ep.youtube_id || cleanId}/hqdefault.jpg`,
          url: targetUrl,
          type: "video.Episode",
        };
      }
    } catch (err) {
      console.error("Supabase episode OG lookup failed:", err);
    }
  }

  // 2. Fallback to YouTube's public oEmbed API (requires no API key)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${cleanId}`
    )}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = (await res.json()) as {
        title?: string;
        author_name?: string;
        thumbnail_url?: string;
      };
      if (data.title) {
        return {
          title: data.title,
          description: `Listen to "${data.title}" on Weave Podcasts.`,
          image: data.thumbnail_url || defaultYtThumb,
          url: targetUrl,
          type: "video.other",
        };
      }
    }
  } catch (err) {
    console.error("YouTube oEmbed fallback failed:", err);
  }

  // 3. Final fallback still uses the specific YouTube video's thumbnail
  return {
    title: "Weave Podcasts",
    description: "Listen to this podcast episode on Weave.",
    image: defaultYtThumb,
    url: targetUrl,
    type: "website",
  };
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const reqUrl = new URL(context.request.url);
  const slug = reqUrl.searchParams.get("slug");
  const episode = reqUrl.searchParams.get("episode");
  const baseUrl = reqUrl.origin;

  if (episode) {
    const meta = await resolveEpisodeOg(episode, baseUrl, context.env);
    return new Response(buildHtml(meta), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (slug) {
    const meta = await resolveStoryOg(slug, baseUrl, context.env);
    return new Response(buildHtml(meta), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response("Missing slug or episode parameter", { status: 400 });
};
