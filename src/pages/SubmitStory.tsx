import { useState, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function SubmitStory() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/submit-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, excerpt, body }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setDone(true);
  }

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
            <p className="mt-4 text-lg text-muted-foreground">
              Got a story, opinion, or experience to share? We'll review it before it goes live.
            </p>
          </Reveal>

          <Card className="mt-10 border-border bg-card">
            <CardContent className="p-6">
              {done ? (
                <p className="text-center text-muted-foreground py-8">
                  Thanks — your story is in for review. We'll publish it if it's a fit.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Your name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Short summary (optional)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Your story…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    required
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" className="rounded-full" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit Story"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
