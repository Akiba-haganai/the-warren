import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";
import type { StoryCard } from "./useLatestStories";

export interface StoryDetail extends StoryCard {
  body: unknown;
}

const QUERY = `*[_type == "story" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  mainImage,
  body,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

export function useStoryBySlug(slug: string | undefined) {
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    sanityClient.fetch<StoryDetail | null>(QUERY, { slug }).then((data) => {
      if (active) {
        setStory(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return { story, loading };
}
