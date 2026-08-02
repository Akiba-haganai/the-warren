import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useStory(slug: string) {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("stories")
      .select("*, story_topics!inner(topic_id, topics(name, slug))")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setStory(data);
          supabase!.rpc("increment_story_view", { story_slug: slug });
        }
        setLoading(false);
      });
  }, [slug]);

  return { story, loading };
}
