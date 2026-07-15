import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Episode } from "@/data/podcasts";

export function usePodcasts(category?: string) {
  const [data, setData] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEpisodes() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        if (!cancelled) {
          setError("Podcast service is not configured.");
          setData([]);
          setLoading(false);
        }
        return;
      }

      let query = supabase
        .from("episodes")
        .select("*")
        .order("published_date", { ascending: false });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      const { data: rows, error: err } = await query;

      if (cancelled) return;

      if (err) {
        setError("Couldn't load episodes. Please try again.");
        setLoading(false);
        return;
      }

      setData(
        (rows ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          youtubeId: row.youtube_id,
          thumbnail: row.thumbnail,
          duration: row.duration,
          category: row.category,
          date: row.published_date,
        })),
      );
      setLoading(false);
    }

    fetchEpisodes();
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { podcasts: data, loading, error };
}