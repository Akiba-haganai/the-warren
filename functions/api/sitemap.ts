import { createClient } from "@sanity/client";

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

const STATIC_PATHS = [
  "/",
  "/explore",
  "/podcasts",
  "/blogs",
  "/culture",
  "/submit",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/products",
  "/ecosystem",
];

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const baseUrl = new URL(context.request.url).origin;
  const sanity = createClient({
    projectId: sanitizeProjectId(context.env.VITE_SANITY_PROJECT_ID),
    dataset: sanitizeDataset(context.env.VITE_SANITY_DATASET),
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  try {
    const [stories, topics, authors] = await Promise.all([
      sanity.fetch(`*[_type == "story" && defined(publishedAt) && defined(slug.current)]{ "slug": slug.current }`),
      sanity.fetch(`*[_type == "topic" && defined(slug.current)]{ "slug": slug.current }`),
      sanity.fetch(`*[_type == "author" && defined(slug.current)]{ "slug": slug.current }`),
    ]);

    const storyUrls = (stories || []).map((s: { slug: string }) => `${baseUrl}/blogs/${s.slug}`);
    const topicUrls = (topics || []).map((t: { slug: string }) => `${baseUrl}/topics/${t.slug}`);
    const authorUrls = (authors || []).map((a: { slug: string }) => `${baseUrl}/authors/${a.slug}`);

    const allUrls = [
      ...STATIC_PATHS.map((p) => baseUrl + p),
      ...storyUrls,
      ...topicUrls,
      ...authorUrls,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map((url) => `<url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new Response("Error generating sitemap", { status: 500 });
  }
};
