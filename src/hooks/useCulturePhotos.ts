import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useCulturePhotos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("culture_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  return { photos, loading };
}
