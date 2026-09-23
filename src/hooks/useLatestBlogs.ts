import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

export interface BlogCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: {
    name: string;
    image?: any;
    slug: string;
  };
  mainImage?: unknown;
  publishedAt?: string;
  topics: { _id: string; title: string; slug: string }[];
}

// Note: no manual "status = published" filter needed. A blog only shows
// up here once it's been Published in Studio — while it's a draft, its
// document id is prefixed `drafts.` and this query (reading the CDN/
// published dataset) simply never sees it. That draft/publish split is
// Sanity's built-in equivalent of the moderation gate we used to enforce
// by hand in Supabase.
const BASE_QUERY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  ${AUTHOR_PROJECTION},
  mainImage,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

export function useLatestBlogs(universitySlug?: string) {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    
    const query = universitySlug
      ? `*[_type == "story" && defined(publishedAt) && (!defined(university) || university->slug.current == $universitySlug)] | order(publishedAt desc) [0...9] ${BASE_QUERY_PROJECTION}`
      : `*[_type == "story" && defined(publishedAt)] | order(publishedAt desc) [0...9] ${BASE_QUERY_PROJECTION}`;

    sanityClient
      .fetch<BlogCard[]>(query, { universitySlug: universitySlug || "" })
      .then((data) => {
        if (active) {
          setBlogs(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch latest blogs from Sanity:", err);
        if (active) {
          setBlogs([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [universitySlug]);

  return { blogs, loading };
}
