import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

export interface CulturePhoto {
  _id: string;
  image: any;
  caption?: string;
  category?: string;
}

const QUERY = `*[_type == "culturePhoto"] | order(order asc) { _id, image, caption, category }`;

export function useCulturePhotos({ enabled = true }: { enabled?: boolean } = {}) {
  const [photos, setPhotos] = useState<CulturePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    sanityClient.fetch<CulturePhoto[]>(QUERY)
      .then((data) => {
        if (active) {
          setPhotos(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch culture photos:", error);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  return { photos, loading };
}

