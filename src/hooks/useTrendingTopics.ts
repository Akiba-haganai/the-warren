import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";

export interface TrendingTopic {
  _id: string;
  name: string;
  slug: string;
  isTrending: boolean;
  postCount: number;
  recentPostCount: number;
  lastUpdated: string | null;
}

const TRENDING_TOPICS_QUERY = `
*[_type == "topic"]{
  _id,
  "name": title,
  "slug": slug.current,
  isTrending,
  "postCount": count(*[_type == "story" && references(^._id)]),
  "recentPostCount": count(*[_type == "story" && references(^._id) && dateTime(publishedAt) > dateTime(now()) - 60*60*24*30]),
  "lastUpdated": *[_type == "story" && references(^._id)] | order(publishedAt desc)[0].publishedAt
} | order(isTrending desc, recentPostCount desc, postCount desc) [0...10]
`;

export function useTrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    sanityClient
      .fetch<TrendingTopic[]>(TRENDING_TOPICS_QUERY, {})
      .then((data) => {
        if (!active) return;
        setTopics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch trending topics:", error);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { topics, loading };
}
