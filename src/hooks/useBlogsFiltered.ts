import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";

const PAGE_SIZE = 12;

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  mainImage?: unknown;
  publishedAt?: string;
  topics: { _id: string; title: string; slug: string }[];
}

export interface TopicItem {
  _id: string;
  title: string;
  slug: string;
}

export function useBlogsFiltered(
  page: number,
  sort: "recent" | "oldest",
  topicSlug: string | null
) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics list once on mount
  useEffect(() => {
    sanityClient
      .fetch<TopicItem[]>(
        `*[_type == "topic"] | order(title asc) { _id, title, "slug": slug.current }`
      )
      .then((data) => setTopics(data || []))
      .catch((err) => console.error("Failed to fetch Sanity topics:", err));
  }, []);

  // Fetch blogs whenever page, sort, or topicSlug changes
  useEffect(() => {
    let active = true;
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const topicFilter = topicSlug ? `&& $topicSlug in topics[]->slug.current` : "";
    const orderClause = sort === "oldest" ? "publishedAt asc" : "publishedAt desc";

    const query = `{
      "total": count(*[_type == "story" && defined(publishedAt) ${topicFilter}]),
      "items": *[_type == "story" && defined(publishedAt) ${topicFilter}] | order(${orderClause}) [$from...$end] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        author,
        mainImage,
        publishedAt,
        "topics": topics[]->{ _id, title, "slug": slug.current }
      }
    }`;

    sanityClient
      .fetch<{ total: number; items: BlogItem[] }>(query, {
        from,
        end: to + 1,
        topicSlug: topicSlug || "",
      })
      .then((data) => {
        if (active) {
          setBlogs(data?.items || []);
          setTotal(data?.total || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch filtered blogs:", err);
        if (active) {
          setBlogs([]);
          setTotal(0);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, sort, topicSlug]);

  return { blogs, total, topics, loading, pageSize: PAGE_SIZE };
}
