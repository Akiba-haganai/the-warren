import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useTopicStories(topicSlug: string) {
  const [stories, setStories] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug || !supabase) {
      setLoading(false);
      return;
    }

    Promise.all([
      supabase.from("topics").select("*").eq("slug", topicSlug).single(),
      supabase
        .from("stories")
        .select("*, story_topics!inner(topic_id, topics!inner(slug))")
        .eq("status", "published")
        .eq("story_topics.topics.slug", topicSlug)
        .order("published_at", { ascending: false }),
    ]).then(([topicRes, storiesRes]) => {
      if (!topicRes.error) setTopic(topicRes.data);
      if (!storiesRes.error) setStories(storiesRes.data || []);
      setLoading(false);
    });
  }, [topicSlug]);

  return { topic, stories, loading };
}
