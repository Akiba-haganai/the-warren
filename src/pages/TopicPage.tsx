import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopicStories } from "@/hooks/useTopicStories";
import { urlForImage } from "@/lib/sanityImage";
import { ArrowLeft } from "lucide-react";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { topic, stories, loading } = useTopicStories(slug || "");

  function coverUrl(mainImage: unknown, w: number, h: number): string | null {
    if (!mainImage) return null;
    try {
      return urlForImage(mainImage as Parameters<typeof urlForImage>[0])
        .width(w)
        .height(h)
        .fit("crop")
        .url();
    } catch {
      return null;
    }
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
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
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
                >
                  <ArrowLeft className="h-4 w-4" /> Home
                </Link>
                <SectionLabel>Topic</SectionLabel>
                <h1 className="mt-2 font-display text-4xl font-semibold">
                  {topic.title}
                </h1>
                {topic.description && (
                  <p className="mt-2 text-muted-foreground max-w-2xl">
                    {topic.description}
                  </p>
                )}
              </Reveal>

              {stories.length === 0 ? (
                <p className="mt-12 text-center text-muted-foreground">
                  No published stories in this topic yet.
                </p>
              ) : (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story) => (
                    <Link key={story._id} to={`/stories/${story.slug}`}>
                      <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition h-full flex flex-col">
                        {coverUrl(story.mainImage, 600, 340) ? (
                          <img
                            src={coverUrl(story.mainImage, 600, 340)!}
                            alt={story.title}
                            className="aspect-video w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-display">
                            W
                          </div>
                        )}
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <Badge className="mb-2 text-xs w-fit">{topic.title}</Badge>
                          <h3 className="font-semibold leading-snug text-base">{story.title}</h3>
                          {story.excerpt && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {story.excerpt}
                            </p>
                          )}
                          <p className="mt-auto pt-3 text-xs text-muted-foreground">
                            By {story.author}
                            {story.publishedAt && (
                              <> &middot; {story.publishedAt.slice(0, 10)}</>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-2xl font-semibold">Topic not found</p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
              >
                <ArrowLeft className="h-4 w-4" /> Return to Home
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
