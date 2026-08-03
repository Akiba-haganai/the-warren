import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";

export interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  mainImage?: unknown;
  publishedAt?: string;
  body: unknown; // Portable Text blocks
  topics: { _id: string; title: string; slug: string }[];
}

// Reads from Sanity's published dataset — draft documents (prefixed `drafts.`)
// are never returned by this query, so publishing in Studio IS the moderation gate.
const QUERY = `*[_type == "story" && slug.current == $slug && defined(publishedAt)][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  mainImage,
  publishedAt,
  body,
  "topics": topics[]->{_id, title, "slug": slug.current}
}`;

export function useStory(slug: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let active = true;
    setLoading(true);
    setNotFound(false);

    sanityClient.fetch<Story | null>(QUERY, { slug }).then((data) => {
      if (!active) return;
      if (data) {
        setStory(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  return { story, loading, notFound };
}
