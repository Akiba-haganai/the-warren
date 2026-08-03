import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";

export interface Topic {
  _id: string;
  title: string;
  slug: string;
}

const QUERY = `*[_type == "topic"] | order(title asc) { _id, title, "slug": slug.current }`;

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    sanityClient
      .fetch<Topic[]>(QUERY)
      .then(setTopics)
      .catch((err) => {
        console.error("Failed to fetch topics from Sanity:", err);
        setTopics([]);
      });
  }, []);

  return topics;
}
