import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopics } from "@/hooks/useTopics";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function SubmitStory() {
  const navigate = useNavigate();
  const { topics, loading: topicsLoading } = useTopics();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !authorName || selectedTopics.length === 0) {
      toast.error("Please fill in all required fields and select at least one topic.");
      return;
    }
    if (!supabase) {
      toast.error("Supabase client is not initialized.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("submit_story", {
        _title: title,
        _body: body,
        _author_name: authorName,
        _topic_ids: selectedTopics,
        _image_url: imageUrl || null,
      });
      if (error) throw error;
      toast.success("Story submitted! You can view your draft using the preview link.");
      const previewToken = data?.[0]?.preview_token;
      if (previewToken) {
        navigate(`/stories/preview/${previewToken}`);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit story.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionLabel>Submit a Story</SectionLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Share your <span className="text-gradient-blue">voice</span>
            </h1>
          </Reveal>

          <Card className="mt-10 border-border bg-card">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your story title"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Your Name *</label>
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="How you want to be credited"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Body *</label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    placeholder="Write your story…"
                    required
                    minLength={10}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Image URL (optional)</label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Topics *</label>
                  {topicsLoading ? (
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {topics.map((topic) => (
                        <Badge
                          key={topic.id}
                          variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {selectedTopics.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Select at least one topic.</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow"
                >
                  {submitting ? "Submitting…" : "Submit Story"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
