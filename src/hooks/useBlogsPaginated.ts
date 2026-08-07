import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
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

export function useBlogsPaginated(page: number) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // We query both the total count and the paginated results in one go.
    // Sanity query array slicing is [start...end] where end is exclusive.
    // So [from...to+1] fetches the right amount.
    const query = `{
      "total": count(*[_type == "story" && defined(publishedAt)]),
        "items": *[_type == "story" && defined(publishedAt)] | order(publishedAt desc) [$from...$end] {
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
      })
      .then((data) => {
        if (active) {
          setBlogs(data?.items || []);
          setTotal(data?.total || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch paginated blogs:", err);
        if (active) {
          setBlogs([]);
          setTotal(0);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page]);

  return { blogs, total, loading, pageSize: PAGE_SIZE };
}
