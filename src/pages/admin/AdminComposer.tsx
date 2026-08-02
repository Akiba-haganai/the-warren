import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { supabase } from "@/lib/supabase";

// marked v18 returns a Promise by default — force synchronous mode
marked.setOptions({ async: false });
import { Header } from "@/components/layout/Header";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, LogOut, Loader2, ArrowLeft } from "lucide-react";

interface Topic {
  id: string;
  name: string;
}

export function AdminComposer() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("topics")
      .select("id, name")
      .order("name")
      .then(({ data }) => setTopics(data ?? []));
  }, []);

  function toggleTopic(id: string) {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setError(null);
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("story-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("story-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  }

  function removeImage() {
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handlePublish() {
    setError(null);

    if (title.trim().length < 3) {
      setError("Title needs at least 3 characters.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Body needs at least 10 characters.");
      return;
    }
    if (authorName.trim().length < 2) {
      setError("Author name needs at least 2 characters.");
      return;
    }
    if (!supabase) {
      setError("Supabase client is not initialized.");
      return;
    }

    setPublishing(true);
    const { data, error } = await supabase.rpc("create_story_as_admin", {
      p_title: title.trim(),
      p_body: body.trim(),
      p_author_name: authorName.trim(),
      p_image_url: imageUrl,
      p_excerpt: excerpt.trim() || null,
      p_topic_ids: selectedTopicIds,
    });
    setPublishing(false);

    if (error) {
      setError(`Couldn't publish: ${error.message}`);
      return;
    }

    setSuccessUrl(`/stories/${data.slug}`);
    setTitle("");
    setAuthorName("");
    setExcerpt("");
    setBody("");
    setSelectedTopicIds([]);
    setImageUrl(null);
  }

  // Safe sync HTML generation — marked.setOptions({ async: false }) guarantees string return
  const previewHtml = DOMPurify.sanitize(
    marked.parse(body || "*Nothing written yet\u2026*") as string
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Composer</SectionLabel>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link to="/admin">
                    <ArrowLeft className="mr-1.5 h-4 w-4" /> Inbox
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => supabase?.auth.signOut()}>
                  <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                </Button>
              </div>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              New <span className="text-gradient-blue">Story</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Write and publish directly — this goes live immediately.
            </p>
          </Reveal>

          {successUrl && (
            <Card className="mt-6 border-green-600/30 bg-green-50 dark:bg-green-950/30">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Published successfully!</p>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to={successUrl}>View story →</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="mt-6 border-red-600/30 bg-red-50 dark:bg-red-950/30">
              <CardContent className="p-4 text-sm text-red-700 dark:text-red-400">
                {error}
              </CardContent>
            </Card>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Left column: metadata + editor */}
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Title *</label>
                    <Input
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Author Name *</label>
                    <Input
                      placeholder="Author name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Excerpt</label>
                    <Textarea
                      placeholder="Short excerpt (optional, shown on story cards)"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Topics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => {
                        const active = selectedTopicIds.includes(topic.id);
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => toggleTopic(topic.id)}
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

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Cover Image
                    </p>
                    {imageUrl ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Cover"
                          className="max-h-48 w-full rounded-lg object-cover border border-border"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full rounded-lg border-2 border-dashed border-border py-8 text-sm text-muted-foreground hover:bg-accent/50 transition flex flex-col items-center gap-2"
                      >
                        {uploading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <ImagePlus className="h-5 w-5 text-blue-600" />
                        )}
                        {uploading ? "Uploading…" : "Click to upload cover image"}
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Body (Markdown supported)
                  </p>
                  <Textarea
                    placeholder="Write your story…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={14}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right column: live preview */}
            <div className="lg:sticky lg:top-32 self-start">
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">
                    Live Preview
                  </p>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Cover"
                      className="mb-4 max-h-56 w-full rounded-lg object-cover"
                    />
                  )}
                  <h2 className="font-display text-2xl font-semibold">
                    {title || "Untitled story"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {authorName || "…"}
                  </p>
                  {excerpt && (
                    <p className="mt-3 text-sm italic text-muted-foreground border-l-2 border-blue-300 pl-3">{excerpt}</p>
                  )}
                  <div
                    className="prose prose-sm dark:prose-invert mt-4 max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handlePublish}
              disabled={publishing || uploading}
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-glow"
            >
              {publishing ? "Publishing…" : "Publish story"}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
