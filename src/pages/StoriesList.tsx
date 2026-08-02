import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoriesPaginated } from "@/hooks/useStoriesPaginated";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StoriesList() {
  const [page, setPage] = useState(1);
  const { stories, total, loading, pageSize } = useStoriesPaginated(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionLabel>Stories</SectionLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              All <span className="text-gradient-blue">Stories</span>
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
          ) : stories.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">No stories published yet.</p>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <Link key={story.id} to={`/stories/${story.slug}`}>
                    <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition h-full">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-display">
                        W
                      </div>
                      <CardContent className="p-4">
                        <Badge className="mb-2 text-xs">
                          {story.story_topics?.[0]?.topics?.name || "General"}
                        </Badge>
                        <h3 className="font-semibold leading-snug">{story.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          By {story.author_name} &middot; {story.published_at?.slice(0, 10)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
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
