import { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import type { BlogCardProps } from "@/components/blog/BlogCard";
import { AUTHOR_PROJECTION } from "@/lib/groq-fragments";

export function useAuthorBlogs(authorSlug: string) {
  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorSlug) {
      setLoading(false);
      return;
    }

    const query = `*[_type == "story" && defined(publishedAt) && (authorProfile->slug.current == $authorSlug || lower(author) == lower($authorSlug))]
      | order(publishedAt desc){
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
      .fetch(query, { authorSlug })
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
        console.error("Failed to fetch author blogs:", err);
        setBlogs([]);
        setLoading(false);
      });
  }, [authorSlug]);

  return { blogs, loading };
}
