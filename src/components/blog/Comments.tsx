import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Reply, CornerDownRight, ShieldAlert } from "lucide-react";

interface Comment {
  id: string;
  blog_slug: string;
  author_name: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  is_approved: boolean;
}

export function Comments({ blogSlug }: { blogSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  async function fetchComments() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("blog_slug", blogSlug)
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
    e.preventDefault();
    if (!supabase) return;

    const author = parentId ? replyName.trim() : name.trim();
    const commentText = parentId ? replyContent.trim() : content.trim();

    if (!author || !commentText) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        blog_slug: blogSlug,
        author_name: author,
        content: commentText,
        parent_id: parentId,
        is_approved: true, // Default to true, moderation is done via manual deletion/disapproval
      });

      if (error) throw error;

      // Reset forms
      if (parentId) {
        setReplyName("");
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setName("");
        setContent("");
      }

      // Re-fetch comments to display the new one
      await fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to build recursive tree hierarchy
  const commentMap = new Map<string, Comment[]>();
  const rootComments: Comment[] = [];

  comments.forEach((c) => {
    if (c.parent_id) {
      const children = commentMap.get(c.parent_id) || [];
      children.push(c);
      commentMap.set(c.parent_id, children);
    } else {
      rootComments.push(c);
    }
  });

  const renderComment = (comment: Comment, depth = 0) => {
    const replies = commentMap.get(comment.id) || [];
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className="mt-6 space-y-4">
        <div className="flex gap-4 items-start">
          {depth > 0 && <CornerDownRight className="h-5 w-5 text-muted-foreground/30 mt-1 shrink-0" />}
          <div className="flex-1 bg-muted/30 border rounded-2xl p-4 transition hover:bg-muted/40">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">{comment.author_name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
            
            {/* Reply Button (Max depth check to prevent infinite nested UI layout issues) */}
            {depth < 3 && (
              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <form
            onSubmit={(e) => handleSubmit(e, comment.id)}
            className="pl-8 sm:pl-12 flex gap-4 items-start"
          >
            <div className="flex-1 space-y-3 bg-muted/10 border p-4 rounded-2xl">
              <span className="text-xs text-muted-foreground">Replying to {comment.author_name}</span>
              <Input
                placeholder="Your name"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                required
                disabled={submitting}
                className="bg-background max-w-xs"
              />
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
                disabled={submitting}
                className="bg-background min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={submitting}>
                  Submit Reply
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Render nested replies */}
        {replies.length > 0 && (
          <div className="pl-6 sm:pl-10 border-l border-border/50">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!supabase) {
    return (
      <div className="mt-16 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-2xl p-4 flex gap-3 items-center">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        <p>Supabase connection is not configured. Comments are currently disabled.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Discussion ({comments.length})</h2>
      </div>

      {/* Main Comment Form */}
      <form onSubmit={(e) => handleSubmit(e, null)} className="space-y-4 mb-8 bg-muted/20 border p-5 rounded-2xl">
        <h3 className="text-sm font-medium">Join the conversation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
            className="bg-background"
          />
        </div>
        <Textarea
          placeholder="What are your thoughts?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={submitting}
          className="bg-background min-h-[100px]"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comment List */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-20 w-full bg-muted animate-pulse rounded-2xl" />
          <div className="h-20 w-3/4 bg-muted animate-pulse rounded-2xl pl-10" />
        </div>
      ) : rootComments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first to start the discussion!
        </p>
      ) : (
        <div className="space-y-6">
          {rootComments.map((comment) => renderComment(comment, 0))}
        </div>
      )}
    </div>
  );
}
