import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStory } from "@/hooks/useStory";
import { urlForImage } from "@/lib/sanityImage";
import { ArrowLeft } from "lucide-react";

export default function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { story, loading, notFound } = useStory(slug || "");

  // Build cover image URL from Sanity image asset
  const coverSrc = story?.mainImage
    ? (() => {
        try {
          return urlForImage(story.mainImage as Parameters<typeof urlForImage>[0])
            .width(1200)
            .height(630)
            .fit("crop")
            .url();
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <article className="mx-auto max-w-3xl px-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-72 w-full rounded-2xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : notFound || !story ? (
            <div className="text-center py-24">
              <p className="text-2xl font-semibold">Story not found</p>
              <p className="text-muted-foreground mt-2">
                This story may have been unpublished or doesn't exist.
              </p>
              <Link
                to="/stories"
                className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all stories
              </Link>
            </div>
          ) : (
            <Reveal>
              {/* Back link */}
              <Link
                to="/stories"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
              >
                <ArrowLeft className="h-4 w-4" /> All Stories
              </Link>

              {/* Topic badges */}
              {story.topics?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.topics.map((t) => (
                    <Link key={t._id} to={`/topics/${t.slug}`}>
                      <Badge variant="secondary" className="hover:bg-accent transition">
                        {t.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <SectionLabel>Story</SectionLabel>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold leading-tight">
                {story.title}
              </h1>

              {/* Meta */}
              <p className="mt-3 text-sm text-muted-foreground">
                By <span className="font-medium text-foreground">{story.author}</span>
                {story.publishedAt && (
                  <>
                    {" "}
                    &middot;{" "}
                    {new Date(story.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </>
                )}
              </p>

              {/* Excerpt / standfirst */}
              {story.excerpt && (
                <p className="mt-4 text-lg text-muted-foreground italic border-l-4 border-blue-400 pl-4 leading-relaxed">
                  {story.excerpt}
                </p>
              )}

              {/* Cover image */}
              {coverSrc && (
                <img
                  src={coverSrc}
                  alt={story.title}
                  className="mt-8 w-full rounded-2xl object-cover shadow-lg"
                  style={{ maxHeight: "480px" }}
                  loading="eager"
                />
              )}

              {/* Body — Portable Text rendered as plain paragraphs for now.
                  To get full rich-text (bold, links, lists, embeds) install
                  @portabletext/react and replace this block. */}
              <div className="mt-10 prose prose-lg dark:prose-invert max-w-none">
                {Array.isArray(story.body)
                  ? (story.body as Array<{ _type: string; children?: Array<{ text: string }> }>)
                      .filter((block) => block._type === "block")
                      .map((block, i) => (
                        <p key={i}>
                          {block.children?.map((span) => span.text).join("")}
                        </p>
                      ))
                  : typeof story.body === "string"
                  ? story.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
                  : null}
              </div>

              {/* Footer nav */}
              <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-sm">
                <Link
                  to="/stories"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-4 w-4" /> All Stories
                </Link>
                <Link to="/submit" className="text-blue-600 hover:underline">
                  Submit your story →
                </Link>
              </div>
            </Reveal>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
