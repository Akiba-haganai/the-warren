import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cachedSupabaseQuery } from "@/lib/supabaseCache";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  university_slug?: string | null;
  campus_slug?: string | null;
}

export function useActivePoll({ enabled = true, universitySlug }: { enabled?: boolean; universitySlug?: string } = {}) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    const cacheKey = `polls:active:${universitySlug || "national"}`;

    cachedSupabaseQuery(cacheKey, async () => {
      let query = supabase!
        .from("polls")
        .select("*")
        .eq("is_active", true);
        
      if (universitySlug) {
        // If campus is selected, find a campus poll, or fallback by including national ones.
        // Actually, Supabase .or() can do this:
        query = query.or(`university_slug.eq.${universitySlug},university_slug.is.null`);
      } else {
        query = query.is("university_slug", null);
      }
      
      const { data, error } = await query
        .order("university_slug", { ascending: true, nullsFirst: false }) // prioritize campus-specific over null
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Poll | null;
    })
      .then((data) => {
        if (!active) return;
        setPoll(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error fetching active poll:", err?.message ?? err);
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, universitySlug]);

  return { poll, loading, error };
}

