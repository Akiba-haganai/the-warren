import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useLatestStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("stories")
      .select("*, story_topics!inner(topic_id, topics(name, slug))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (!error && data) setStories(data);
        setLoading(false);
      });
  }, []);

  return { stories, loading };
}
