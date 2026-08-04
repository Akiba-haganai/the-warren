import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Hash } from "lucide-react";
import { useTopicBlogs } from "@/hooks/useTopicBlogs";
import { BlogCard } from "@/components/blog/BlogCard";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { topic, blogs, loading } = useTopicBlogs(slug || "");

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        {/* Hero banner */}
        <section className="bg-muted/30 border-b -mt-8 mb-12">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-16 mb-4" />
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : !topic ? (
              <div className="py-8">
                <Hash className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold">Topic not found</h1>
                <p className="text-muted-foreground mt-2">
                  This topic doesn't exist or has been removed.
                </p>
              </div>
            ) : (
              <Reveal>
                <SectionLabel>Topic</SectionLabel>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight capitalize">
                  {topic.title}
                </h1>
                {topic.description && (
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {topic.description}
                  </p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} in this topic
                </p>
              </Reveal>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Explore Topics
          </Link>

          {!loading && topic && (
            <div>
              {blogs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">No blogs in this topic yet.</p>
                  <p className="text-muted-foreground mt-2">Check back soon for new posts.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog, i) => (
                    <Reveal key={blog._id} delay={i * 0.05}>
                      <BlogCard
                        blog={{
                          id: blog._id,
                          slug: blog.slug,
                          title: blog.title,
                          excerpt: blog.excerpt,
                          author: blog.author,
                          mainImage: blog.mainImage,
                          publishedAt: blog.publishedAt,
                          topic: blog.topics?.[0],
                        }}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-2xl" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
