// src/components/podcast/PodcastComments.tsx
import { useState, useEffect } from "react";
import { MessageSquare, Send, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface EpisodeComment {
  id: string;
  episodeId: string;
  authorName: string;
  content: string;
  timestampSeconds?: number;
  createdAt: string;
}

function formatTime(seconds?: number): string {
  if (seconds === undefined || !isFinite(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface PodcastCommentsProps {
  episodeId: string;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

const USER_NAME_KEY = "weave:user_display_name";

export function PodcastComments({ episodeId, currentTime, onSeek }: PodcastCommentsProps) {
  const storageKey = `weave:episode_comments:${episodeId}`;

  const [comments, setComments] = useState<EpisodeComment[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [authorName, setAuthorName] = useState(() => {
    try {
      return localStorage.getItem(USER_NAME_KEY) || "";
    } catch {
      return "";
    }
  });

  const [newComment, setNewComment] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setComments(saved ? JSON.parse(saved) : []);
    } catch {
      setComments([]);
    }
  }, [episodeId, storageKey]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const trimmedAuthor = authorName.trim() || "Anonymous Listener";
    try {
      if (authorName.trim()) {
        localStorage.setItem(USER_NAME_KEY, authorName.trim());
      }
    } catch {}

    const entry: EpisodeComment = {
      id: `c_${Date.now()}`,
      episodeId,
      authorName: trimmedAuthor,
      content: newComment.trim(),
      timestampSeconds: includeTimestamp ? Math.floor(currentTime) : undefined,
      createdAt: "Just now",
    };

    const updated = [entry, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    setNewComment("");
    toast.success("Comment posted!");
  };

  return (
    <div className="w-full mt-6 border-t border-border/40 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" /> Episode Comments ({comments.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs gap-1.5"
          onClick={() => setIncludeTimestamp(!includeTimestamp)}
        >
          <Clock className="h-3 w-3" />
          {includeTimestamp ? `Pin at ${formatTime(currentTime)}` : "No timestamp"}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleAddComment} className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <div className="relative w-1/3 min-w-[120px]">
            <Input
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="rounded-full text-xs bg-muted/50 pl-7"
            />
            <User className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <Input
            placeholder={
              includeTimestamp
                ? `Comment at @${formatTime(currentTime)}...`
                : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="rounded-full text-xs flex-1 bg-muted/50"
          />
          <Button type="submit" size="sm" className="rounded-full gap-1.5 shrink-0 bg-primary text-primary-foreground">
            <Send className="h-3.5 w-3.5" /> Post
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            No comments yet. Share your thoughts or pin a question at a timestamp!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-card border border-border/50 text-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">{c.authorName}</span>
                <span className="text-[10px]">{c.createdAt}</span>
              </div>
              <p className="text-foreground/90">{c.content}</p>
              {c.timestampSeconds !== undefined && (
                <button
                  onClick={() => onSeek(c.timestampSeconds!)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md transition"
                >
                  <Clock className="h-3 w-3" /> @{formatTime(c.timestampSeconds)}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
