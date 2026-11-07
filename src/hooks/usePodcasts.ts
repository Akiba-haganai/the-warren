import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cachedSupabaseQuery } from "@/lib/supabaseCache";
import type { Episode } from "@/data/podcasts";

export function usePodcasts(category?: string, { enabled = true }: { enabled?: boolean } = {}) {
  const [data, setData] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function fetchEpisodes() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        if (!cancelled) {
          console.warn("Supabase not configured: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided at build time.");
          setError("Podcast service is not configured. Please check your Supabase environment variables.");
          setData([]);
          setLoading(false);
        }
        return;
      }

      const cacheKey = `episodes:${category ?? "all"}:national`;

      try {
        const rows = await cachedSupabaseQuery(cacheKey, async () => {
          let query = supabase!
            .from("episodes")
            .select("*")
            .order("published_date", { ascending: false });

          if (category && category !== "All") {
            query = query.eq("category", category);
          }

          const { data: rows, error: err } = await query;
          if (err) throw err;
          return rows ?? [];
        });

        if (cancelled) return;

        setData(
          (rows as any[]).map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            youtubeId: row.youtube_id,
            thumbnail: row.thumbnail,
            duration: row.duration,
            category: row.category,
            date: row.published_date,
          }))
        );
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("usePodcasts query failed:", err);
        setError("Couldn't load episodes. Please try again.");
        setLoading(false);
      }
    }

    fetchEpisodes();
    return () => {
      cancelled = true;
    };
  }, [category, enabled]);

  return { podcasts: data, loading, error };
}
