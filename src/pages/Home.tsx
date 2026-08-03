import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Camera,
  Send,
} from "lucide-react";
import { useTrendingTopics } from "@/hooks/useTrendingTopics";
import { useLatestBlogs } from "@/hooks/useLatestBlogs";
import { useActivePoll } from "@/hooks/useActivePoll";
import { useCulturePhotos } from "@/hooks/useCulturePhotos";
import { usePodcasts } from "@/hooks/usePodcasts";
import { supabase } from "@/lib/supabase";
import { BlogCard } from "@/components/blog/BlogCard";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <MediaHero />
        <TrendingTopics />
        <LatestBlogs />
        <StudentVoicePoll />
        <PodcastTeaser />
        <CultureSnapshot />
        <YourVoiceCTA />
        <DiscoverWarren />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Media Hero                                                        */
/* ------------------------------------------------------------------ */
function MediaHero() {
  return (
    <section className="relative pt-32 pb-20 bg-hero overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Warren Media
          </Badge>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-balance">
            CBU, beyond the classroom.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Stories &bull; Conversations &bull; Culture
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trending Topics                                                   */
/* ------------------------------------------------------------------ */
function TrendingTopics() {
  const { topics, loading } = useTrendingTopics();

  return (
    <section className="py-12 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-6">
            <SectionLabel>Discover</SectionLabel>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Trending Now</h2>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="text-muted-foreground text-sm">Trending topics will appear here soon.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/topics/${topic.slug}`}
                className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Latest Blogs                                                      */
/* ------------------------------------------------------------------ */
function LatestBlogs() {
  const { blogs, loading } = useLatestBlogs();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Read</SectionLabel>
          <h2 className="text-2xl font-semibold mt-2 mb-8">Latest Blogs</h2>
        </Reveal>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No blogs published yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.slice(0, 4).map((blog, i) => (
              <Reveal key={blog._id} delay={0.05 + i * 0.05}>
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Student Voice (Poll)                                              */
/* ------------------------------------------------------------------ */
function StudentVoicePoll() {
  const { poll, loading } = useActivePoll();
  const [voterId, setVoterId] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<any[] | null>(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    let vid = localStorage.getItem("warren_voter_id");
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("warren_voter_id", vid);
    }
    setVoterId(vid);
  }, []);

  useEffect(() => {
    if (!poll || !voterId || !supabase) return;

    // Use maybeSingle — returns null (not 406) when the user hasn't voted yet
    supabase
      .from("poll_votes")
      .select("option_index")
      .eq("poll_id", poll.id)
      .eq("voter_id", voterId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setHasVoted(true);
          setSelectedOption(data.option_index);
          // poll_results is a view — guard against it not existing yet
          // supabase is non-null here (checked above), but TS loses narrowing across the .then() boundary
          supabase!
            .from("poll_votes")
            .select("option_index")
            .eq("poll_id", poll.id)
            .then(({ data: votes }) => {
              if (!votes) return;
              // Tally votes client-side as fallback if poll_results view is missing
              const tally: Record<number, number> = {};
              for (const v of votes) {
                tally[v.option_index] = (tally[v.option_index] ?? 0) + 1;
              }
              setResults(
                Object.entries(tally).map(([option_index, vote_count]) => ({
                  poll_id: poll.id,
                  option_index: Number(option_index),
                  vote_count,
                }))
              );
            });
        }
      });
  }, [poll, voterId]);

  const handleVote = async (optionIndex: number) => {
    if (hasVoted || voting || !poll || !supabase) return;
    setVoting(true);
    const { error } = await supabase.from("poll_votes").insert({
      poll_id: poll.id,
      option_index: optionIndex,
      voter_id: voterId,
    });
    if (!error) {
      setHasVoted(true);
      setSelectedOption(optionIndex);
      // Tally all votes for this poll client-side (avoids dependency on poll_results view)
      const { data: votes } = await supabase
        .from("poll_votes")
        .select("option_index")
        .eq("poll_id", poll.id);
      if (votes) {
        const tally: Record<number, number> = {};
        for (const v of votes) {
          tally[v.option_index] = (tally[v.option_index] ?? 0) + 1;
        }
        setResults(
          Object.entries(tally).map(([idx, count]) => ({
            poll_id: poll.id,
            option_index: Number(idx),
            vote_count: count,
          }))
        );
      }
    }
    setVoting(false);
  };

  const totalVotes = results ? results.reduce((sum: number, r: any) => sum + r.vote_count, 0) : 0;

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionLabel>Speak</SectionLabel>
          <h2 className="text-2xl font-semibold mt-2 mb-6">Student Voice</h2>
          {loading ? (
            <Card>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ) : poll ? (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <p className="font-medium text-lg mb-4">{poll.question}</p>

                {hasVoted && results ? (
                  <div className="space-y-3">
                    {poll.options.map((option: string, i: number) => {
                      const voteCount = results.find((r: any) => r.option_index === i)?.vote_count || 0;
                      const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      return (
                        <div key={i} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              {option} {i === selectedOption && "(you)"}
                            </span>
                            <span className="text-xs text-muted-foreground">{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-muted-foreground mt-2">
                      {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {poll.options.map((option: string, i: number) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-start rounded-xl"
                        onClick={() => handleVote(i)}
                        disabled={voting}
                      >
                        {option}
                      </Button>
                    ))}
                    <p className="mt-4 text-xs text-muted-foreground">
                      Vote to see results. Your response is anonymous.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No active poll right now. Check back later!
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Podcast Teaser                                                    */
/* ------------------------------------------------------------------ */
function PodcastTeaser() {
  const { podcasts, loading } = usePodcasts();
  const latest = podcasts?.[0];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>Listen</SectionLabel>
          <div className="flex items-center justify-between mt-2 mb-6">
            <h2 className="text-2xl font-semibold">Latest Podcast</h2>
            <Button asChild variant="ghost" className="text-blue-600">
              <Link to="/podcasts">
                All Episodes <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {loading ? (
          <Card>
            <div className="grid md:grid-cols-2">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </div>
          </Card>
        ) : latest ? (
          <Reveal delay={0.05}>
            <Link to={`/podcasts`}>
              <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition">
                <div className="grid md:grid-cols-2">
                  <img
                    src={latest.thumbnail}
                    alt={latest.title}
                    className="aspect-video object-cover"
                    loading="lazy"
                  />
                  <CardContent className="p-6 flex flex-col justify-center">
                    <Badge className="mb-2 w-fit">{latest.category}</Badge>
                    <h3 className="font-display text-2xl font-semibold">{latest.title}</h3>
                    <p className="mt-2 text-muted-foreground">{latest.description}</p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </Reveal>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No episodes yet. Coming soon!
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Culture Snapshot                                                  */
/* ------------------------------------------------------------------ */
function CultureSnapshot() {
  const { photos, loading } = useCulturePhotos();

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionLabel>See</SectionLabel>
          <div className="flex items-center gap-2 mt-2 mb-6">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">CBU Culture</h2>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No photos yet. Share your campus moments!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <Reveal key={photo.id || i} delay={i * 0.05}>
                <img
                  src={photo.image_url}
                  alt={photo.caption || "CBU culture"}
                  className="aspect-square object-cover rounded-xl"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Your Voice CTA                                                    */
/* ------------------------------------------------------------------ */
function YourVoiceCTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <SectionLabel>Create</SectionLabel>
          <h2 className="text-2xl font-semibold mt-2 mb-4">Have something to say?</h2>
          <p className="text-muted-foreground mb-6">
            Share your blog, opinion, or experience with the CBU community.
          </p>
          <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow">
            <Link to="/submit">
              <Send className="mr-2 h-4 w-4" /> Submit a Blog
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Discover Warren                                                   */
/* ------------------------------------------------------------------ */
function DiscoverWarren() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <SectionLabel>Explore</SectionLabel>
          <h2 className="text-2xl font-semibold mt-2 mb-2">Discover Warren</h2>
          <p className="text-muted-foreground mb-8">
            Everything CBU students need, in one place.
          </p>
          <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow">
            <Link to="/explore">
              Explore Warren <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}