import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { ArrowLeft, User } from "lucide-react";
import { useAuthorBlogs } from "@/hooks/useAuthorBlogs";
import { BlogCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorPage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : "";
  const { blogs, loading } = useAuthorBlogs(decodedName);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        {/* Hero banner */}
        <section className="bg-muted/30 border-b -mt-8 mb-12">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            <Reveal>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <SectionLabel>Author</SectionLabel>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                {decodedName}
              </h1>
              {!loading && (
                <p className="mt-4 text-muted-foreground">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
                </p>
              )}
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All Blogs
          </Link>

          {loading ? (
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
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium">No blogs found for this author.</p>
              <p className="text-muted-foreground mt-2">This author hasn't published any blogs yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <Reveal key={blog.id} delay={i * 0.05}>
                  <BlogCard blog={blog} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
