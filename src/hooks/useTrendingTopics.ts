import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useTrendingTopics() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("topics")
      .select("*")
      .eq("is_trending", true)
      .order("name")
      .then(({ data, error }) => {
        if (!error && data) setTopics(data);
        setLoading(false);
      });
  }, []);

  return { topics, loading };
}
