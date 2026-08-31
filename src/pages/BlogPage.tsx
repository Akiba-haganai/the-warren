import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlog } from "@/hooks/useBlog";
import { useRelatedBlogs } from "@/hooks/useRelatedBlogs";
import { BlogCard } from "@/components/blog/BlogCard";
import { Comments } from "@/components/blog/Comments";
import { StoryBody } from "@/components/StoryBody";
import { urlForImage } from "@/lib/sanityImage";
import { ArrowLeft } from "lucide-react";
import { ShareRow } from "@/components/blog/ShareRow";
import { LikeButton } from "@/components/blog/LikeButton";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { calculateReadingTime } from "@/lib/readingTime";
import { UpNextToast } from "@/components/blog/UpNextToast";

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { blog, loading, notFound } = useBlog(slug || "");

  useEffect(() => {
    if (blog?.title) {
      document.title = `${blog.title} — Warren Media`;
    }
    return () => {
      document.title = "Warren — The Digital Home for Students";
    };
  }, [blog]);

  const endOfArticleRef = useRef<HTMLDivElement>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!endOfArticleRef.current) return;
    
    // Reset trigger when slug changes
    hasTriggered.current = false;
    setToastVisible(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered.current) {
          setToastVisible(true);
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(endOfArticleRef.current);

    return () => observer.disconnect();
  }, [slug, loading]);

  const topicSlugs = useMemo(() => blog?.topics?.map((t) => t.slug) || [], [blog?.topics]);
  const { blogs: relatedBlogs, loading: relatedLoading } = useRelatedBlogs(
    slug || "",
    topicSlugs
  );

  // Build cover image URL from Sanity image asset
  const coverSrc = blog?.mainImage
    ? (() => {
        try {
          return urlForImage(blog.mainImage as Parameters<typeof urlForImage>[0])
            .width(1200)
            .height(600)
            .fit("crop")
            .auto("format")
            .quality(75)
            .url();
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <>
      <Header />
      <ReadingProgress />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <article className="mx-auto max-w-4xl px-6">
          {loading ? (
            <div className="space-y-6 max-w-[750px] mx-auto">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : notFound || !blog ? (
            <div className="text-center py-24">
              <p className="text-2xl font-semibold">Blog not found</p>
              <p className="text-muted-foreground mt-2">
                This blog may have been unpublished or doesn't exist.
              </p>
              <Link
                to="/blogs"
                className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all blogs
              </Link>
            </div>
          ) : (
            <Reveal>
              <div className="max-w-[750px] mx-auto">
                {/* Top Nav (Back / Submit) */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    <ArrowLeft className="h-4 w-4" /> All Blogs
                  </Link>
                  <Link
                    to="/submit"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                  >
                    Share your story
                  </Link>
                </div>

                {/* Topic badges */}
                {blog.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.topics.map((t) => (
                      <Link key={t._id} to={`/topics/${t.slug}`}>
                        <Badge variant="secondary" className="hover:bg-accent transition">
                          {t.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title */}
                <SectionLabel>Blog</SectionLabel>
                <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-balance">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-display text-lg font-semibold uppercase overflow-hidden">
                    {blog.author?.image ? (
                      <img
                        src={urlForImage(blog.author.image).width(88).height(88).fit("crop").auto("format").quality(75).url()}
                        alt={blog.author.name}
                        width={88}
                        height={88}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (blog.author?.name || "W").charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="text-base font-medium">
                      By{" "}
                      <Link
                        to={`/authors/${encodeURIComponent(blog.author?.slug || "warren-team")}`}
                        className="text-foreground hover:text-blue-600 transition underline-offset-2 hover:underline"
                      >
                        {blog.author?.name || "Warren Team"}
                      </Link>
                    </div>
                    {blog.publishedAt && (
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <span className="mx-1.5">•</span>
                        {calculateReadingTime(blog.body as any[])} min read
                      </div>
                    )}
                  </div>
                </div>

                {/* Engagement row */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <LikeButton blogSlug={blog.slug} />
                  <div className="h-6 w-px bg-border hidden sm:block" />
                  <ShareRow
                    title={blog.title}
                    excerpt={blog.excerpt}
                    slug={blog.slug}
                    compact
                  />
                </div>

                {/* Excerpt / standfirst */}
                {blog.excerpt && (
                  <p className="mt-8 text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
              </div>

              {/* Cover image - Allows full width of max-w-4xl for visual interest */}
              {coverSrc && (
                <div className="mt-10 mb-12">
                  <img
                    src={coverSrc}
                    alt={blog.title}
                    width={1200}
                    height={600}
                    className="w-full rounded-2xl shadow-lg mx-auto aspect-[2/1] object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Body — Constrained for reading */}
              <div className="max-w-[750px] mx-auto">
                <StoryBody value={blog.body} />

                {/* Bottom Engagement Row */}
                <div 
                  ref={endOfArticleRef}
                  className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-y border-border"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <LikeButton blogSlug={blog.slug} />
                    <div className="h-6 w-px bg-border hidden sm:block" />
                    <ShareRow
                      title={blog.title}
                      excerpt={blog.excerpt}
                      slug={blog.slug}
                      compact
                    />
                  </div>
                </div>

                {/* Related Blogs Section */}
                {!relatedLoading && relatedBlogs.length > 0 && (
                  <div className="mt-16 pt-8 border-t border-border">
                    <h2 className="text-2xl font-semibold mb-6">More like this</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {relatedBlogs.map((b, i) => (
                        <Reveal key={b.id} delay={i * 0.05}>
                          <BlogCard blog={b} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="mt-12 rounded-3xl bg-muted/30 p-6 sm:p-8 border border-border/50">
                  <Comments blogSlug={blog.slug} />
                </div>

                {/* Footer nav */}
                <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-sm">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition"
                  >
                    <ArrowLeft className="h-4 w-4" /> All Blogs
                  </Link>
                  <Link to="/submit" className="text-blue-600 hover:underline">
                    Submit your blog →
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </article>
        
        {!relatedLoading && relatedBlogs.length > 0 && (
          <UpNextToast 
            blog={relatedBlogs[0]} 
            visible={toastVisible} 
            onDismiss={() => setToastVisible(false)} 
          />
        )}
      </main>
      <Footer />
    </>
  );
}
