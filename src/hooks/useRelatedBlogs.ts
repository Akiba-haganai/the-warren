import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import type { BlogCardProps } from "@/components/blog/BlogCard";

import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

export function useRelatedBlogs(currentSlug: string, topicSlugs: string[]) {
  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const topicSlugsKey = (topicSlugs || []).join(",");

  useEffect(() => {
    if (!currentSlug || !topicSlugs || topicSlugs.length === 0) {
      setBlogs([]);
      setLoading(false);
      return;
    }

    const query = `*[_type == "story" && defined(publishedAt)
      && slug.current != $currentSlug
      && count((topics[]->slug.current)[@ in $topicSlugs]) > 0]
      | order(publishedAt desc)[0...3]{
        _id,
        title,
        excerpt,
        mainImage,
        ${AUTHOR_PROJECTION},
        publishedAt,
        "slug": slug.current,
        "topics": topics[]->{ _id, title, "slug": slug.current }
      }`;

    sanityClient
      .fetch(query, { currentSlug, topicSlugs })
      .then((data: any) => {
        const mapped = (data || []).map((blog: any) => ({
          id: blog._id,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          author: blog.author,
          mainImage: blog.mainImage,
          publishedAt: blog.publishedAt,
          topic: blog.topics?.[0],
        }));
        setBlogs(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch related blogs:", err);
        setBlogs([]);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug, topicSlugsKey]);

  return { blogs, loading };
}
