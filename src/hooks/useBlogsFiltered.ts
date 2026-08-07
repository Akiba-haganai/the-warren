import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import { supabase } from "@/lib/supabase";
import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

const PAGE_SIZE = 12;

export interface BlogItem {
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

export interface TopicItem {
  _id: string;
  title: string;
  slug: string;
}

export type BlogSort = "recent" | "oldest" | "most_liked";

export function useBlogsFiltered(
  page: number,
  sort: BlogSort,
  topicSlug: string | null
) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  /** Like counts for the current page's blogs — keyed by slug */
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(new Map());

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

    const topicFilter = topicSlug ? `&& $topicSlug in topics[]->slug.current` : "";

    if (sort === "most_liked") {
      // For "most_liked": fetch ALL matching blogs from Sanity (unpaginated),
      // fetch all like counts, sort by count, then paginate in-memory.
      const query = `*[_type == "story" && defined(publishedAt) ${topicFilter}] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        ${AUTHOR_PROJECTION},
        mainImage,
        publishedAt,
        "topics": topics[]->{ _id, title, "slug": slug.current }
      }`;

      Promise.all([
        sanityClient.fetch<BlogItem[]>(query, { topicSlug: topicSlug || "" }),
        supabase
          ? supabase
              .from("blog_like_counts")
              .select("blog_slug, like_count")
              .then(({ data }) => data || [])
          : Promise.resolve([]),
      ])
        .then(([allBlogs, likesData]) => {
          if (!active) return;

          // Build a count map
          const countMap = new Map<string, number>();
          for (const row of likesData as { blog_slug: string; like_count: number }[]) {
            countMap.set(row.blog_slug, row.like_count);
          }

          // Sort all blogs by like count descending, then by date as tiebreaker
          const sorted = [...allBlogs].sort((a, b) => {
            const aCount = countMap.get(a.slug) || 0;
            const bCount = countMap.get(b.slug) || 0;
            if (bCount !== aCount) return bCount - aCount;
            // Tiebreaker: most recent first
            return (
              new Date(b.publishedAt || 0).getTime() -
              new Date(a.publishedAt || 0).getTime()
            );
          });

          // In-memory pagination
          const from = (page - 1) * PAGE_SIZE;
          const pageItems = sorted.slice(from, from + PAGE_SIZE);

          setTotal(sorted.length);
          setBlogs(pageItems);
          setLikeCounts(countMap);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch most-liked blogs:", err);
          if (active) {
            setBlogs([]);
            setTotal(0);
            setLoading(false);
          }
        });
    } else {
      // For "recent" / "oldest": use Sanity's order + pagination directly
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const orderClause = sort === "oldest" ? "publishedAt asc" : "publishedAt desc";

      const query = `{
        "total": count(*[_type == "story" && defined(publishedAt) ${topicFilter}]),
        "items": *[_type == "story" && defined(publishedAt) ${topicFilter}] | order(${orderClause}) [$from...$end] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          ${AUTHOR_PROJECTION},
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
          if (!active) return;
          const items = data?.items || [];
          setBlogs(items);
          setTotal(data?.total || 0);

          // Batch-fetch like counts for this page's slugs
          const slugs = items.map((b) => b.slug);
          if (supabase && slugs.length > 0) {
            supabase
              .from("blog_like_counts")
              .select("blog_slug, like_count")
              .in("blog_slug", slugs)
              .then(({ data: likesData }) => {
                if (!active) return;
                const map = new Map<string, number>();
                for (const row of (likesData || []) as { blog_slug: string; like_count: number }[]) {
                  map.set(row.blog_slug, row.like_count);
                }
                setLikeCounts(map);
              });
          } else {
            setLikeCounts(new Map());
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch filtered blogs:", err);
          if (active) {
            setBlogs([]);
            setTotal(0);
            setLoading(false);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [page, sort, topicSlug]);

  return { blogs, total, topics, loading, pageSize: PAGE_SIZE, likeCounts };
}
