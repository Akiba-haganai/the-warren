import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import type { StoryCard } from "./useLatestStories";

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

const STORIES_QUERY = `*[_type == "story" && defined(publishedAt) && $slug in topics[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  mainImage,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

export function useTopicStories(topicSlug: string) {
  const [stories, setStories] = useState<StoryCard[]>([]);
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
      sanityClient.fetch<StoryCard[]>(STORIES_QUERY, { slug: topicSlug }),
    ])
      .then(([tData, sData]) => {
        if (active) {
          setTopic(tData);
          setStories(sData || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch topic stories from Sanity:", err);
        if (active) {
          setTopic(null);
          setStories([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [topicSlug]);

  return { topic, stories, loading };
}
