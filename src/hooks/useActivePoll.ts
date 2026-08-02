import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export function useActivePoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Error fetching active poll:", error.message);
          setError(true);
        } else {
          setPoll(data);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { poll, loading, error };
}
