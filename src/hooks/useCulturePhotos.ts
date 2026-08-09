import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

export interface CulturePhoto {
  _id: string;
  image: any;
  caption?: string;
  category?: string;
}

const QUERY = `*[_type == "culturePhoto"] | order(order asc) { _id, image, caption, category }`;

export function useCulturePhotos() {
  const [photos, setPhotos] = useState<CulturePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    sanityClient.fetch<CulturePhoto[]>(QUERY).then((data) => {
      if (active) {
        setPhotos(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { photos, loading };
}
