import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopicStories } from "@/hooks/useTopicStories";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { topic, stories, loading } = useTopicStories(slug || "");

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-7xl px-6">
          {loading ? (
            <>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
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
            </>
          ) : topic ? (
            <>
              <Reveal>
                <SectionLabel>{topic.name}</SectionLabel>
                <h1 className="mt-4 font-display text-4xl font-semibold">
                  {topic.name} Stories
                </h1>
              </Reveal>

              {stories.length === 0 ? (
                <p className="mt-10 text-center text-muted-foreground">No stories yet in this topic.</p>
              ) : (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story) => (
                    <Link key={story.id} to={`/stories/${story.slug}`}>
                      <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition h-full">
                        <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-display">
                          W
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2 text-xs">{topic.name}</Badge>
                          <h3 className="font-semibold leading-snug">{story.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            By {story.author_name} &middot; {story.published_at?.slice(0, 10)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground">Topic not found.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
