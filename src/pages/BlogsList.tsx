import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogsFiltered, type BlogSort } from "@/hooks/useBlogsFiltered";
import { BlogCard } from "@/components/blog/BlogCard";
import { ChevronLeft, ChevronRight, Search, Clock, Calendar, Heart } from "lucide-react";

export default function BlogsList() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<BlogSort>("recent");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { blogs, total, topics, loading, pageSize, likeCounts } = useBlogsFiltered(
    page,
    sort,
    selectedTopic
  );

  // Client-side text search over current page items with defensive null checks
  const filteredBlogs = blogs.filter((b) => {
    const q = search.toLowerCase();
    const titleMatch = b.title ? b.title.toLowerCase().includes(q) : false;
    const excerptMatch = b.excerpt ? b.excerpt.toLowerCase().includes(q) : false;
    const authorMatch = b.author?.name ? b.author.name.toLowerCase().includes(q) : false;
    return titleMatch || excerptMatch || authorMatch;
  });

  const totalPages = Math.ceil(total / pageSize);

  const handleTopicChange = (slug: string | null) => {
    setSelectedTopic(slug);
    setPage(1);
  };

  const handleSortChange = (newSort: BlogSort) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6">
          {/* Header section */}
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <SectionLabel>Blogs</SectionLabel>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                  All <span className="text-gradient-blue">Blogs</span>
                </h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-xl">
                  Explore stories, opinions, and campus culture written by CBU students.
                </p>
              </div>
              <a href="/submit" className="shrink-0">
                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95">
                  Share your story
                </Button>
              </a>
            </div>
          </Reveal>

          {/* Search & Filters Controls */}
          <div className="mt-10 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs or authors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full bg-card"
                />
              </div>

              {/* Sort buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-1 hidden sm:inline">
                  Sort:
                </span>
                <Button
                  variant={sort === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("recent")}
                  className="rounded-full gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5" /> Recent
                </Button>
                <Button
                  variant={sort === "oldest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("oldest")}
                  className="rounded-full gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" /> Oldest
                </Button>
                <Button
                  variant={sort === "most_liked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("most_liked")}
                  className="rounded-full gap-1.5"
                >
                  <Heart className="h-3.5 w-3.5" /> Most Liked
                </Button>
              </div>
            </div>

            {/* Topic Chips Filter Row (horizontal scroll) */}
            {topics.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  variant={selectedTopic === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTopicChange(null)}
                  className="rounded-full shrink-0"
                >
                  All Topics
                </Button>
                {topics.map((topic) => (
                  <Button
                    key={topic._id}
                    variant={selectedTopic === topic.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTopicChange(topic.slug)}
                    className="rounded-full shrink-0"
                  >
                    {topic.title}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Results grid / states */}
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
          ) : total === 0 ? (
            /* Topic empty state */
            <div className="mt-20 text-center py-12 border border-dashed rounded-3xl p-8 max-w-md mx-auto">
              <p className="text-xl font-semibold">No stories in this topic yet</p>
              <p className="text-muted-foreground text-sm mt-2">
                Be the first to share an article in this topic!
              </p>
              {selectedTopic && (
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => handleTopicChange(null)}
                >
                  Show all topics
                </Button>
              )}
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* Search empty state */
            <div className="mt-20 text-center py-12 border border-dashed rounded-3xl p-8 max-w-md mx-auto">
              <p className="text-xl font-semibold">No search results</p>
              <p className="text-muted-foreground text-sm mt-2">
                No blogs matched &quot;{search}&quot;. Try a different query or clear your search.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((blog) => (
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
                      likeCount: likeCounts.get(blog.slug) ?? 0,
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    aria-label="Next page"
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
