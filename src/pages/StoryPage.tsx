import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStory } from "@/hooks/useStory";

export default function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { story, loading } = useStory(slug || "");

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-3xl px-6">
          {loading ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : story ? (
            <Reveal>
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.story_topics?.map((st: any) => (
                      <Badge key={st.topic_id} variant="secondary">
                        {st.topics?.name}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-semibold">
                    {story.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    By {story.author_name} &middot; {story.published_at?.slice(0, 10)}{" "}
                    &middot; {story.view_count} views
                  </p>
                  <div className="mt-6 prose max-w-none">{story.body}</div>
                </CardContent>
              </Card>
            </Reveal>
          ) : (
            <p className="text-center text-muted-foreground">Story not found.</p>
          )}

          <div className="mt-8 text-center">
            <Link to="/stories" className="text-blue-600 underline text-sm">
              ← All Stories
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
