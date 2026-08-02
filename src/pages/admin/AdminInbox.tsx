import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Header } from "@/components/layout/Header";
import {
  Check,
  X,
  Image as ImageIcon,
  LogOut,
  Sparkles,
  Plus,
} from "lucide-react";

interface Topic {
  id: string;
  name: string;
}

interface DraftStory {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  author_name: string;
  image_url: string | null;
  created_at: string;
}

export function AdminInbox() {
  const [drafts, setDrafts] = useState<DraftStory[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({});
  const [revealedImages, setRevealedImages] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadDrafts() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: storyData }, { data: topicData }] = await Promise.all([
      supabase
        .from("stories")
        .select("id, title, excerpt, body, author_name, image_url, created_at")
        .eq("status", "draft")
        .order("created_at", { ascending: true }),
      supabase.from("topics").select("id, name").order("name"),
    ]);
    setDrafts(storyData ?? []);
    setTopics(topicData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadDrafts();
  }, []);

  function toggleTopic(storyId: string, topicId: string) {
    setSelectedTopics((prev) => {
      const current = prev[storyId] ?? [];
      const next = current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId];
      return { ...prev, [storyId]: next };
    });
  }

  async function handlePublish(storyId: string) {
    if (!supabase) return;
    setBusyId(storyId);
    const { error } = await supabase.rpc("publish_story", {
      p_story_id: storyId,
      p_topic_ids: selectedTopics[storyId] ?? [],
    });
    setBusyId(null);
    if (error) {
      alert(`Couldn't publish: ${error.message}`);
      return;
    }
    setDrafts((prev) => prev.filter((s) => s.id !== storyId));
  }

  async function handleReject(storyId: string) {
    if (!supabase) return;
    if (!confirm("Reject this story? It will be archived, not deleted.")) return;
    setBusyId(storyId);
    const { error } = await supabase.rpc("reject_story", { p_story_id: storyId });
    setBusyId(null);
    if (error) {
      alert(`Couldn't reject: ${error.message}`);
      return;
    }
    setDrafts((prev) => prev.filter((s) => s.id !== storyId));
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <div className="mx-auto max-w-4xl px-6">
          {/* Title */}
          <Reveal>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Admin</SectionLabel>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link to="/admin/new">
                    <Plus className="mr-1.5 h-4 w-4" /> New Story
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => supabase?.auth.signOut()}>
                  <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                </Button>
              </div>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Story <span className="text-gradient-blue">Inbox</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {loading
                ? "Loading submissions…"
                : `${drafts.length} pending story${drafts.length === 1 ? "" : "s"}`}
            </p>
          </Reveal>

          {/* Loading state */}
          {loading && (
            <div className="mt-10 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && drafts.length === 0 && (
            <Card className="mt-10 border-border bg-card">
              <CardContent className="p-16 text-center">
                <Sparkles className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold">All caught up!</h2>
                <p className="text-muted-foreground mt-2">
                  No pending submissions. New stories from the /submit page will show up here.
                </p>
                <div className="mt-6">
                  <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow">
                    <Link to="/admin/new">
                      <Plus className="mr-1.5 h-4 w-4" /> Create a Story
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Draft list */}
          <div className="mt-10 space-y-6">
            {drafts.map((story, i) => {
              const isBusy = busyId === story.id;
              const imageRevealed = revealedImages[story.id];

              return (
                <Reveal key={story.id} delay={i * 0.05}>
                  <Card className="border-border bg-card hover:shadow-glow transition">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="mb-2">
                            Draft
                          </Badge>
                          <h2 className="font-display text-xl font-semibold leading-snug">
                            {story.title}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {story.author_name} &middot;{" "}
                            {new Date(story.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Excerpt */}
                      {story.excerpt && (
                        <p className="mt-3 text-sm text-muted-foreground italic border-l-2 border-blue-300 pl-3">
                          {story.excerpt}
                        </p>
                      )}

                      {/* Body preview */}
                      <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-6 leading-relaxed">
                        {story.body}
                      </p>

                      {/* Image */}
                      {story.image_url && (
                        <div className="mt-4">
                          {imageRevealed ? (
                            <img
                              src={story.image_url}
                              alt="Submitted"
                              className="max-h-64 rounded-lg border border-border object-cover shadow-sm"
                            />
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setRevealedImages((prev) => ({ ...prev, [story.id]: true }))
                              }
                            >
                              <ImageIcon className="mr-1.5 h-4 w-4" /> Show submitted image
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Topic selector */}
                      <div className="mt-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          Topics
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {topics.map((topic) => {
                            const active = (selectedTopics[story.id] ?? []).includes(topic.id);
                            return (
                              <button
                                key={topic.id}
                                type="button"
                                onClick={() => toggleTopic(story.id, topic.id)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                  active
                                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                              >
                                {topic.name}
                              </button>
                            );
                          })}
                          {topics.length === 0 && (
                            <span className="text-xs text-muted-foreground">
                              No topics yet — add some to the topics table.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex gap-3">
                        <Button
                          onClick={() => handlePublish(story.id)}
                          disabled={isBusy}
                          className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow"
                        >
                          <Check className="mr-1.5 h-4 w-4" /> Publish
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(story.id)}
                          disabled={isBusy}
                          className="rounded-full border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <X className="mr-1.5 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
