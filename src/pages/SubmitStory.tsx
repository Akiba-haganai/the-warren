import { useState, useRef, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Send, CheckCircle } from "lucide-react";
import Turnstile from "react-turnstile";

export default function SubmitStory() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!turnstileToken) {
      setError("Please complete the security verification below.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/submit-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        author,
        excerpt,
        body,
        turnstileToken,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      // Reset the Turnstile widget so user can re-verify
      setTurnstileToken(null);
      setTurnstileKey((prev) => prev + 1);
      return;
    }

    setDone(true);
  }

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
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
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold">Story submitted!</h2>
                  <p className="text-muted-foreground mt-2">
                    Thanks — your story is in for review. We'll publish it if it's a fit.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-full"
                    onClick={() => {
                      setDone(false);
                      setTitle("");
                      setAuthor("");
                      setExcerpt("");
                      setBody("");
                      setTurnstileToken(null);
                    }}
                  >
                    Submit another story
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Title *
                    </label>
                    <Input
                      placeholder="Title of your story"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Your name *
                    </label>
                    <Input
                      placeholder="How should we credit you?"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Summary
                    </label>
                    <Textarea
                      placeholder="Short summary (optional — we'll write one if you don't)"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                      Your story *
                    </label>
                    <Textarea
                      placeholder="Write your story here…"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={10}
                      required
                    />
                  </div>

                  {/* Turnstile bot protection */}
                  {siteKey ? (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Security verification
                        </span>
                      </div>
                      <Turnstile
                        key={turnstileKey}
                        sitekey={siteKey}
                        onVerify={(token: string) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        theme="auto"
                      />
                    </div>
                  ) : (
                    // Dev fallback when no site key is configured
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      ⚠ Turnstile site key not configured — bot protection disabled in dev.
                    </p>
                  )}

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow"
                    disabled={submitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
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
