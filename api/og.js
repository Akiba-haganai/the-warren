import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) {
    res.status(400).send("Missing slug");
    return;
  }

  const { data: story } = await supabase
    .from("stories")
    .select("title, excerpt, image_url, author_name")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!story) {
    res.status(404).send("Story not found");
    return;
  }

  const baseUrl = "https://the-warren-hub.vercel.app";
  const title = `${story.title} — Warren Media`;
  const description = story.excerpt || "Read this story on Warren Media.";
  const image = story.image_url || `${baseUrl}/warren-preview.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${baseUrl}/stories/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${baseUrl}/stories/${slug}" />
</head>
<body>
  <p>Redirecting to <a href="${baseUrl}/stories/${slug}">${title}</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
