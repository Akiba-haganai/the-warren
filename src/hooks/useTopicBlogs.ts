import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import type { BlogCard } from "./useLatestBlogs";
import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

export interface TopicInfo {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

const TOPIC_QUERY = `*[_type == "topic" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description
}`;

const BLOGS_QUERY = `*[_type == "story" && defined(publishedAt) && $slug in topics[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  ${AUTHOR_PROJECTION},
  mainImage,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

export function useTopicBlogs(topicSlug: string) {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.all([
      sanityClient.fetch<TopicInfo | null>(TOPIC_QUERY, { slug: topicSlug }),
      sanityClient.fetch<BlogCard[]>(BLOGS_QUERY, { slug: topicSlug }),
    ])
      .then(([tData, sData]) => {
        if (active) {
          setTopic(tData);
          setBlogs(sData || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch topic blogs from Sanity:", err);
        if (active) {
          setTopic(null);
          setBlogs([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [topicSlug]);

  return { topic, blogs, loading };
}
