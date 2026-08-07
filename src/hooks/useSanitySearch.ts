import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";

export interface SearchResultStory {
  _id: string;
  title: string;
  slug: string;
  mainImage?: any;
}

export interface SearchResultTopic {
  _id: string;
  title: string;
  slug: string;
}

export function useSanitySearch(query: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<SearchResultStory[]>([]);
  const [topics, setTopics] = useState<SearchResultTopic[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setStories([]);
      setTopics([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchSearch = async () => {
      try {
        // Use wildcards on both sides for mid-word substring matching
        const searchTerm = `*${debouncedQuery}*`;

        const [fetchedStories, fetchedTopics] = await Promise.all([
          sanityClient.fetch<SearchResultStory[]>(
            `*[_type == "story" && defined(publishedAt) && (title match $searchTerm || excerpt match $searchTerm)] | order(publishedAt desc)[0...5] {
              _id,
              title,
              "slug": slug.current,
              mainImage
            }`,
            { searchTerm }
          ),
          sanityClient.fetch<SearchResultTopic[]>(
            `*[_type == "topic" && title match $searchTerm][0...3] {
              _id,
              title,
              "slug": slug.current
            }`,
            { searchTerm }
          ),
        ]);

        if (isMounted) {
          setStories(fetchedStories || []);
          setTopics(fetchedTopics || []);
        }
      } catch (error) {
        console.error("Error searching Sanity:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return { loading, stories, topics, debouncedQuery };
}
