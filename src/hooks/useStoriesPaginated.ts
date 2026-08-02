import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 12;

export function useStoriesPaginated(page: number) {
  const [stories, setStories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    supabase
      .from("stories")
      .select("*, story_topics!inner(topic_id, topics(name, slug))", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, to)
      .then(({ data, count, error }) => {
        if (!error) {
          setStories(data || []);
          setTotal(count || 0);
        }
        setLoading(false);
      });
  }, [page]);

  return { stories, total, loading, pageSize: PAGE_SIZE };
}
