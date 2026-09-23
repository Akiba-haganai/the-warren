import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.VITE_SANITY_PROJECT_ID || "7yislksr";
const dataset = process.env.VITE_SANITY_DATASET || "production";

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);

function getSanityImageUrl(mainImage: any) {
  if (!mainImage) return null;
  try {
    return builder.image(mainImage).width(1200).url();
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  if (!slug) {
    res.status(400).send("Missing slug");
    return;
  }

  const baseUrl = "https://warren-weave.vercel.app";

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
      // Graceful fallback: return a generic preview card instead of a bare 404
      const html = buildHtml({
        title: "WEAVE — Stories. Culture. What's happening.",
        description: "Read the latest stories and blogs from your campus.",
        image: `${baseUrl}/warren-preview.png`,
        url: `${baseUrl}/blogs`,
      });
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    }

    const title = story.title;
    const description =
      story.excerpt || "Read this story on your campus platform.";
    const image =
      getSanityImageUrl(story.mainImage) || `${baseUrl}/warren-preview.png`;
    const url = `${baseUrl}/blogs/${slug}`;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(buildHtml({ title, description, image, url }));
  } catch (err) {
    console.error("OG tags handler error:", err);
    // Graceful fallback on Sanity error — return generic preview, not a broken page
    const html = buildHtml({
      title: "WEAVE — Stories. Culture. What's happening.",
      description: "Read the latest stories and blogs from your campus.",
      image: `${baseUrl}/warren-preview.png`,
      url: baseUrl,
    });
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  }
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

function buildHtml({ title, description, image, url }: { title: string; description: string; image: string; url: string }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:url" content="${safeUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WEAVE" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${safeImage}" />
  <meta http-equiv="refresh" content="0;url=${safeUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${safeUrl}">${safeTitle}</a></p>
</body>
</html>`;
}
