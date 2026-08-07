import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getBrowserId } from "@/lib/browserId";

const LIKED_KEY = "warren_liked_blogs";

/** Read the Set of liked slugs from localStorage. */
function getLikedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/** Persist the Set of liked slugs to localStorage. */
function saveLikedSet(set: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
}

export function useBlogLikes(blogSlug: string) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Initialise from localStorage synchronously so we don't flash an empty heart
  useEffect(() => {
    setLiked(getLikedSet().has(blogSlug));
  }, [blogSlug]);

  // Fetch count from the blog_like_counts view
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase
      .from("blog_like_counts")
      .select("like_count")
      .eq("blog_slug", blogSlug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          setLikeCount(data.like_count as number);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [blogSlug]);

  const toggleLike = useCallback(async () => {
    if (!supabase || isToggling) return;
    setIsToggling(true);

    try {
      const browserId = getBrowserId();
      const likedSet = getLikedSet();
      const isCurrentlyLiked = likedSet.has(blogSlug);

      if (isCurrentlyLiked) {
        // Optimistic update — unlike
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
        likedSet.delete(blogSlug);
        saveLikedSet(likedSet);

        const { error } = await supabase
          .from("blog_likes")
          .delete()
          .eq("blog_slug", blogSlug)
          .eq("browser_id", browserId);

        if (error) {
          // Revert on failure
          setLiked(true);
          setLikeCount((c) => c + 1);
          likedSet.add(blogSlug);
          saveLikedSet(likedSet);
        }
      } else {
        // Optimistic update — like
        setLiked(true);
        setLikeCount((c) => c + 1);
        likedSet.add(blogSlug);
        saveLikedSet(likedSet);

        const { error } = await supabase
          .from("blog_likes")
          .insert({ blog_slug: blogSlug, browser_id: browserId });

        if (error) {
          // Revert on failure (includes unique-constraint duplicates, which
          // means the DB already has our like — leave UI as "liked")
          if (error.code === "23505") {
            // Unique violation — we already liked, keep state as liked
            return;
          }
          setLiked(false);
          setLikeCount((c) => Math.max(0, c - 1));
          likedSet.delete(blogSlug);
          saveLikedSet(likedSet);
        }
      }
    } finally {
      setIsToggling(false);
    }
  }, [blogSlug, isToggling]);

  return { likeCount, liked, toggleLike, loading, isToggling };
}
