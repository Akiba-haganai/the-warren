import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface LikeCountRow {
  blog_slug: string;
  like_count: number;
}

/**
 * Batch-fetches like counts for an array of blog slugs in a single query.
 * Returns a Map<slug, count> that can be passed into BlogCard props.
 */
export function useBlogLikeCounts(slugs: string[]) {
  const [counts, setCounts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  // Stable key so the effect doesn't re-run on every render
  const slugKey = slugs.join(",");

  useEffect(() => {
    if (!supabase || slugs.length === 0) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    supabase
      .from("blog_like_counts")
      .select("blog_slug, like_count")
      .in("blog_slug", slugs)
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          const map = new Map<string, number>();
          for (const row of data as LikeCountRow[]) {
            map.set(row.blog_slug, row.like_count);
          }
          setCounts(map);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugKey]);

  return { counts, loading };
}
