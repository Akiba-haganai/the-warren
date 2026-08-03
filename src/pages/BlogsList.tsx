import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useBlogsPaginated } from "@/hooks/useBlogsPaginated";
import { BlogCard } from "@/components/blog/BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogsList() {
  const [page, setPage] = useState(1);
  const { blogs, total, loading, pageSize } = useBlogsPaginated(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionLabel>Blogs</SectionLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              All <span className="text-gradient-blue">Blogs</span>
            </h1>
          </Reveal>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="mt-20 text-center">
              <p className="text-2xl font-semibold">No blogs found</p>
              <p className="text-muted-foreground mt-2">
                There are no published blogs yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
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
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
