import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "7yislksr",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const BASE_URL = "https://the-warren-hub.vercel.app";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch all published stories (blogs)
    const stories = await sanity.fetch(
      `*[_type == "story" && defined(publishedAt)]{ "slug": slug.current }`
    );

    // Fetch all topics
    const topics = await sanity.fetch(
      `*[_type == "topic"]{ "slug": slug.current }`
    );

    // Fetch distinct authors
    const authors = await sanity.fetch(
      `array::unique(*[_type == "story" && defined(publishedAt)].author)`
    );

    const storyUrls = (stories || []).map((s: any) => `${BASE_URL}/blogs/${s.slug}`);
    const topicUrls = (topics || []).map((t: any) => `${BASE_URL}/topics/${t.slug}`);
    const authorUrls = (authors || []).map((a: string) => `${BASE_URL}/authors/${encodeURIComponent(a)}`);

    const allUrls = [
      ...STATIC_PATHS.map((p) => BASE_URL + p),
      ...storyUrls,
      ...topicUrls,
      ...authorUrls,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map((url) => `<url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Error generating sitemap");
  }
}
