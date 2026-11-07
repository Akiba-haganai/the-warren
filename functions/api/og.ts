import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

interface Env {
  VITE_SANITY_PROJECT_ID?: string;
  VITE_SANITY_DATASET?: string;
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

function buildHtml({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle} — Weave</title>
  <meta name="description" content="${safeDesc}">
  <meta property="og:type" content="article">
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

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const reqUrl = new URL(context.request.url);
  const slug = reqUrl.searchParams.get("slug");
  const baseUrl = reqUrl.origin;

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const projectId = sanitizeProjectId(context.env.VITE_SANITY_PROJECT_ID);
  const dataset = sanitizeDataset(context.env.VITE_SANITY_DATASET);

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
        mainImage,
        author
      }`,
      { slug }
    );

    if (!story) {
      const html = buildHtml({
        title: "Weave — Stories, Podcasts & Culture",
        description: "Discover stories, podcasts, and culture for everyone.",
        image: `${baseUrl}/og-image-1200x630.png`,
        url: `${baseUrl}/blogs`,
      });
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const title = story.title;
    const description =
      story.excerpt || "Read this story on Weave.";
    const image =
      getSanityImageUrl(story.mainImage) || `${baseUrl}/og-image-1200x630.png`;
    const url = `${baseUrl}/blogs/${slug}`;

    return new Response(buildHtml({ title, description, image, url }), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("OG tags handler error:", err);
    const html = buildHtml({
      title: "Weave — Stories, Podcasts & Culture",
      description: "Discover stories, podcasts, and culture for everyone.",
      image: `${baseUrl}/og-image-1200x630.png`,
      url: baseUrl,
    });
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
};
