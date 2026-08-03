import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

export default function StoryPreview() {
  const { token } = useParams<{ token: string }>();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !supabase) {
      setLoading(false);
      return;
    }
    supabase
      .rpc("get_story_preview", { token })
      .then(({ data, error }) => {
        if (!error && data?.length) setStory(data[0]);
        setLoading(false);
      });
  }, [token]);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionLabel>Preview</SectionLabel>
            <h1 className="mt-4 font-display text-4xl font-semibold">
              Your Story Preview
            </h1>
          </Reveal>

          {loading ? (
            <Card className="mt-10">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ) : story ? (
            <Card className="mt-10 border-border bg-card">
              <CardContent className="p-6">
                <Badge className="mb-2">{story.status}</Badge>
                <h2 className="text-2xl font-display font-semibold">{story.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  By {story.author_name} &middot; {story.created_at?.slice(0, 10)}
                </p>
                <div className="mt-6 prose max-w-none">{story.body}</div>
                {story.status === "draft" && (
                  <p className="mt-6 text-sm text-amber-600 dark:text-amber-400">
                    This story is pending review. We'll notify you once it's published.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="mt-10 text-center text-muted-foreground">
              Story not found. The preview link may be invalid.
            </p>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 underline text-sm">
              ← Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
