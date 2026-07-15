import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePodcasts } from "@/hooks/usePodcasts";
import { AdUnit } from "@/components/ads/AdUnit";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Podcasts() {
  const { playEpisode, currentEpisode, restoreFromEpisodes } = usePlayer();
  const { podcasts, loading, error } = usePodcasts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const restoredRef = useRef(false);

  const categories = ["All", "Entrepreneurship", "Faith", "Career", "Relationships", "Academics"];

  // Filter and search logic
  const filtered = podcasts
    .filter((ep) => filter === "All" || ep.category === filter)
    .filter(
      (ep) =>
        ep.title.toLowerCase().includes(search.toLowerCase()) ||
        ep.description.toLowerCase().includes(search.toLowerCase()),
    );

  // Featured episodes (first 3, from the full unfiltered list)
  const featured = podcasts.slice(0, 3);

  // Once episodes have loaded, try to resume whatever was playing last
  // time (if anything). Only runs once per page load.
  useEffect(() => {
    if (!loading && podcasts.length > 0 && !restoredRef.current && !currentEpisode) {
      restoreFromEpisodes(podcasts);
      restoredRef.current = true;
    }
  }, [loading, podcasts, currentEpisode, restoreFromEpisodes]);

  return (
    <>
      <Header />
      <main className="pt-28 pb-24">
        <section className="mx-auto max-w-7xl px-6">
          {/* Title */}
          <Reveal>
            <SectionLabel>Podcasts</SectionLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              <span className="text-gradient-blue">Warren</span> Podcasts
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Conversations about student life, faith, career, and everything in between.
            </p>
          </Reveal>

          {/* Featured carousel (if episodes exist) */}
          {featured.length > 0 && !loading && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">Featured Episodes</h2>
              <Carousel>
                <CarouselContent>
                  {featured.map((ep) => (
                    <CarouselItem key={ep.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card
                        className={`overflow-hidden border-border bg-card hover:shadow-glow transition ${
                          currentEpisode?.id === ep.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="relative">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full aspect-video object-cover" loading="lazy" />
                          <button
                            onClick={() => playEpisode(ep, featured)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition"
                            aria-label={`Play ${ep.title}`}
                          >
                            <Play className="h-12 w-12 text-white fill-white" />
                          </button>
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {ep.duration}
                          </span>
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">{ep.category}</Badge>
                          <h3 className="font-semibold text-base leading-snug">{ep.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{ep.date}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          )}

          {/* Search bar + category filter */}
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search episodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mt-12 text-center py-20">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          )}

          {/* Empty state (no episodes match search/filter) */}
          {!loading && !error && filtered.length === 0 && (
            <div className="mt-12 text-center py-20">
              <p className="text-muted-foreground">No episodes match your search.</p>
              {(search || filter !== "All") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Episode grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : filtered.map((ep, i) => (
                  <Reveal key={ep.id} delay={i * 0.05}>
                    <motion.div whileHover={{ y: -4 }}>
                      <Card
                        className={`overflow-hidden border-border bg-card hover:shadow-glow transition ${
                          currentEpisode?.id === ep.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="relative">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full aspect-video object-cover" loading="lazy" />
                          <button
                            onClick={() => playEpisode(ep, filtered)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition"
                            aria-label={`Play ${ep.title}`}
                          >
                            <Play className="h-12 w-12 text-white fill-white" />
                          </button>
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {ep.duration}
                          </span>
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">{ep.category}</Badge>
                          <h3 className="font-semibold text-base leading-snug">{ep.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{ep.date}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Reveal>
                ))}
          </div>

          {/* AdSense */}
          <div className="mt-16">
            <AdUnit slot="1234567890" format="horizontal" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}