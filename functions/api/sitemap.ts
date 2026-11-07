import { createClient } from "@sanity/client";

interface Env {
  VITE_SANITY_PROJECT_ID?: string;
  VITE_SANITY_DATASET?: string;
}

const STATIC_PATHS = [
  "/",
  "/explore",
  "/podcasts",
  "/blogs",
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
    projectId: context.env.VITE_SANITY_PROJECT_ID || "7yislksr",
    dataset: context.env.VITE_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  try {
    const [stories, topics, authors] = await Promise.all([
      sanity.fetch(`*[_type == "story" && defined(publishedAt)]{ "slug": slug.current }`),
      sanity.fetch(`*[_type == "topic"]{ "slug": slug.current }`),
      sanity.fetch(`array::unique(*[_type == "story" && defined(publishedAt)].author)`),
    ]);

    const storyUrls = (stories || []).map((s: { slug: string }) => `${baseUrl}/blogs/${s.slug}`);
    const topicUrls = (topics || []).map((t: { slug: string }) => `${baseUrl}/topics/${t.slug}`);
    const authorUrls = (authors || []).map((a: string) => `${baseUrl}/authors/${encodeURIComponent(a)}`);

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
