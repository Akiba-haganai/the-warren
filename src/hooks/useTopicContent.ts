import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import { supabase } from "@/lib/supabase";
import type { BlogCard } from "./useLatestBlogs";
import type { CulturePhoto } from "./useCulturePhotos";
import type { Episode } from "@/data/podcasts";
import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

export interface TopicInfo {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  matchedCategories?: string[];
}

const TOPIC_QUERY = `*[_type == "topic" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  seoTitle,
  seoDescription,
  matchedCategories
}`;

const BLOGS_QUERY = `*[_type == "story" && defined(publishedAt) && $slug in topics[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  ${AUTHOR_PROJECTION},
  mainImage,
  publishedAt,
  "topics": topics[]->{ _id, title, "slug": slug.current }
}`;

const PHOTOS_QUERY = `*[_type == "culturePhoto" && category in $matchedCategories] | order(publishedAt desc) {
  _id,
  caption,
  category,
  image,
  publishedAt
}`;

export function useTopicContent(topicSlug: string) {
  const [topic, setTopic] = useState<TopicInfo | null>(null);
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [photos, setPhotos] = useState<CulturePhoto[]>([]);
  const [podcasts, setPodcasts] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    async function fetchContent() {
      try {
        // 1. Fetch Topic & Blogs concurrently
        const [tData, sData] = await Promise.all([
          sanityClient.fetch<TopicInfo | null>(TOPIC_QUERY, { slug: topicSlug }),
          sanityClient.fetch<BlogCard[]>(BLOGS_QUERY, { slug: topicSlug }),
        ]);

        if (!active) return;
        setTopic(tData);
        setBlogs(sData || []);

        const matchedCats = tData?.matchedCategories || [];

        // 2. If we have matched categories, fetch Photos and Podcasts
        if (matchedCats.length > 0) {
          const photosPromise = sanityClient.fetch<CulturePhoto[]>(PHOTOS_QUERY, { matchedCategories: matchedCats });
          
          const podcastsPromise = supabase 
            ? supabase.from("episodes")
                .select("*")
                .in("category", matchedCats)
                .order("published_date", { ascending: false })
            : Promise.resolve({ data: null, error: null });

          const [pData, podRes] = await Promise.all([photosPromise, podcastsPromise]);
          
          if (!active) return;
          
          setPhotos(pData || []);
          
          if (podRes.data) {
            setPodcasts(
              podRes.data.map((row: any) => ({
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
          }
        } else {
          setPhotos([]);
          setPodcasts([]);
        }
      } catch (err) {
        console.error("Failed to fetch topic content:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchContent();

    return () => {
      active = false;
    };
  }, [topicSlug]);

  return { topic, blogs, photos, podcasts, loading };
}
