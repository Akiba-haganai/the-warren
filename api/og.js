import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "7yislksr",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

function getSanityImageUrl(mainImage) {
  if (!mainImage) return null;
  if (mainImage.asset?.url) return mainImage.asset.url;
  const ref = mainImage.asset?._ref;
  if (!ref) return null;
  
  // Format of ref: "image-a1b2c3d4e5f6-1200x800-jpg"
  const parts = ref.split("-");
  if (parts.length < 4) return null;
  
  const id = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  
  const projectId = process.env.VITE_SANITY_PROJECT_ID || "7yislksr";
  const dataset = process.env.VITE_SANITY_DATASET || "production";
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
}

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) {
    res.status(400).send("Missing slug");
    return;
  }

  try {
    const story = await sanity.fetch(
      `*[_type == "story" && slug.current == $slug && defined(publishedAt)][0]{
        title,
        excerpt,
        mainImage,
        author
      }`,
      { slug }
    );

    if (!story) {
      res.status(404).send("Blog not found");
      return;
    }

    const baseUrl = "https://the-warren-hub.vercel.app";
    const title = `${story.title} — Warren Media`;
    const description = story.excerpt || "Read this blog on Warren Media.";
    const image = getSanityImageUrl(story.mainImage) || `${baseUrl}/warren-preview.png`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${baseUrl}/blogs/${slug}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${baseUrl}/blogs/${slug}" />
</head>
<body>
  <p>Redirecting to <a href="${baseUrl}/blogs/${slug}">${title}</a></p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("OG tags handler error:", err);
    res.status(500).send("Error generating preview card");
  }
}
