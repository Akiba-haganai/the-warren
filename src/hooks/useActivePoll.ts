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
}

export function useActivePoll({ enabled = true }: { enabled?: boolean } = {}) {
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

    cachedSupabaseQuery("polls:active", async () => {
      const { data, error } = await supabase!
        .from("polls")
        .select("*")
        .eq("is_active", true)
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
  }, [enabled]);

  return { poll, loading, error };
}

