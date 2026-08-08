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
  } catch (err) {
    console.error("builder error:", err);
    return null;
  }
}

async function test() {
  const slug = "my-croc-flew-away";
  const story = await sanity.fetch(
    `*[_type == "story" && slug.current == $slug][0]{
      title,
      excerpt,
      mainImage,
      author
    }`,
    { slug }
  );

  console.log("Story Title:", story?.title);
  console.log("Story MainImage:", JSON.stringify(story?.mainImage, null, 2));
  
  if (story?.mainImage) {
    const url = getSanityImageUrl(story.mainImage);
    console.log("Generated URL:", url);
  } else {
    console.log("No mainImage found on story!");
  }
}

test().catch(console.error);
