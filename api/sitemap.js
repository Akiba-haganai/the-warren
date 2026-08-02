import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const BASE_URL = "https://the-warren-hub.vercel.app";

const STATIC_PATHS = [
  "/",
  "/explore",
  "/podcasts",
  "/stories",
  "/submit",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/products",
  "/ecosystem",
];

export default async function handler(req, res) {
  const { data: stories } = await supabase
    .from("stories")
    .select("slug")
    .eq("status", "published");

  const storyUrls = (stories || []).map(
    (s) => `${BASE_URL}/stories/${s.slug}`
  );
  const allUrls = [...STATIC_PATHS.map((p) => BASE_URL + p), ...storyUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map((url) => `<url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
