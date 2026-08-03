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
        <section className="mx-auto max-w-7xl px-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Explore Topics
          </Link>

          {loading ? (
            <div className="mb-12">
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
          ) : !topic ? (
            <div className="py-24 text-center">
              <Hash className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold">Topic not found</h1>
              <p className="text-muted-foreground mt-2">
                This topic doesn't exist or has been removed.
              </p>
            </div>
          ) : (
            <Reveal>
              <div className="mb-12">
                <SectionLabel>Topic</SectionLabel>
                <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight capitalize">
                  {topic.title}
                </h1>
                {topic.description && (
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                    {topic.description}
                  </p>
                )}
              </div>
            </Reveal>
          )}

          {!loading && topic && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">Blogs about {topic.title}</h2>
              {blogs.length === 0 ? (
                <p className="text-muted-foreground">No blogs in this topic yet.</p>
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
        </section>
      </main>
      <Footer />
    </>
  );
}
