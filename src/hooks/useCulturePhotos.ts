import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

export interface CulturePhoto {
  _id: string;
  image: any;
  caption?: string;
  category?: string;
}

const QUERY = `*[_type == "culturePhoto"] | order(order asc)[0...12] { _id, image, caption, category }`;

export function useCulturePhotos({ enabled = true, universitySlug }: { enabled?: boolean; universitySlug?: string } = {}) {
  const [photos, setPhotos] = useState<CulturePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    const query = universitySlug
      ? `*[_type == "culturePhoto" && (!defined(university) || university->slug.current == $universitySlug)] | order(order asc)[0...12] { _id, image, caption, category }`
      : `*[_type == "culturePhoto"] | order(order asc)[0...12] { _id, image, caption, category }`;

    sanityClient.fetch<CulturePhoto[]>(query, { universitySlug: universitySlug || "" })
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
  }, [enabled, universitySlug]);

  return { photos, loading };
}

