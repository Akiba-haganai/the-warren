import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Hash, Clock, Play } from "lucide-react";
import { useTopicContent } from "@/hooks/useTopicContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/lib/sanityImage";
import { usePlayer } from "@/contexts/PlayerContext";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { topic, blogs, photos, podcasts, loading } = useTopicContent(slug || "");
  const { playEpisode } = usePlayer();

  useEffect(() => {
    if (!topic) return;
    
    const originalTitle = document.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute("content") || "";

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    document.title = topic.seoTitle || `${topic.title} - WEAVE`;
    
    if (topic.seoDescription) {
      metaDescription.setAttribute("content", topic.seoDescription);
    } else if (topic.description) {
      metaDescription.setAttribute("content", topic.description);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute("content", originalDescription);
      }
    };
  }, [topic]);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        {/* Hero banner */}
        <section className="bg-muted/30 border-b -mt-8 mb-12">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-16 mb-4" />
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : !topic ? (
              <div className="py-8">
                <Hash className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold">Topic not found</h1>
                <p className="text-muted-foreground mt-2">
                  This topic doesn't exist or has been removed.
                </p>
              </div>
            ) : (
              <Reveal>
                <SectionLabel>Topic</SectionLabel>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight capitalize">
                  {topic.title}
                </h1>
                {topic.description && (
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {topic.description}
                  </p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} in this topic
                </p>
              </Reveal>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Explore Topics
          </Link>

          {!loading && topic && (
            <Tabs defaultValue="blogs" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="blogs">Blogs ({blogs.length})</TabsTrigger>
                {photos.length > 0 && (
                  <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
                )}
                {podcasts.length > 0 && (
                  <TabsTrigger value="podcasts">Podcasts ({podcasts.length})</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="blogs" className="mt-0">
                {blogs.length === 0 ? (
                  <div className="text-center py-16 border rounded-2xl bg-muted/20">
                    <p className="text-lg text-muted-foreground">No blogs in this topic yet.</p>
                  </div>
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
              </TabsContent>

              {photos.length > 0 && (
                <TabsContent value="photos" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, i) => (
                      <Reveal key={photo._id} delay={i * 0.05}>
                        <figure className="group relative overflow-hidden rounded-2xl bg-muted/40 aspect-square shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
                          <img
                            src={urlForImage(photo.image).width(600).height(600).fit("crop").url()}
                            alt={photo.caption || "campus culture photo"}
                            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4 flex flex-col justify-end">
                            {photo.caption && (
                              <figcaption className="text-xs text-white/90 font-medium line-clamp-2">
                                {photo.caption}
                              </figcaption>
                            )}
                          </div>
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </TabsContent>
              )}

              {podcasts.length > 0 && (
                <TabsContent value="podcasts" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {podcasts.map((ep, i) => (
                      <Reveal key={ep.id} delay={i * 0.05}>
                        <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition h-full flex flex-col">
                          <div className="relative">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-full aspect-video object-cover"
                              loading="lazy"
                            />
                            <button
                              onClick={() => playEpisode(ep, podcasts)}
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition"
                              aria-label={`Play ${ep.title}`}
                            >
                              <Play className="h-12 w-12 text-white fill-white" />
                            </button>
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {ep.duration}
                            </span>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <Badge variant="secondary" className="mb-2">
                              {ep.category}
                            </Badge>
                            <h3 className="font-semibold text-base leading-snug line-clamp-2">
                              {ep.title}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {ep.date}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}

          {loading && (
            <div className="space-y-8">
              <Skeleton className="h-10 w-64 rounded-full" />
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
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
