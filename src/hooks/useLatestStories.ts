import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

export interface StoryCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  mainImage?: unknown;
  publishedAt?: string;
  topics: { _id: string; title: string; slug: string }[];
}

// Note: no manual "status = published" filter needed. A story only shows
// up here once it's been Published in Studio — while it's a draft, its
// document id is prefixed `drafts.` and this query (reading the CDN/
// published dataset) simply never sees it. That draft/publish split is
// Sanity's built-in equivalent of the moderation gate we used to enforce
// by hand in Supabase.
const QUERY = `*[_type == "story" && defined(publishedAt)] | order(publishedAt desc) [0...9] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  mainImage,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

export function useLatestStories() {
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    sanityClient.fetch<StoryCard[]>(QUERY).then((data) => {
      if (active) {
        setStories(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { stories, loading };
}
