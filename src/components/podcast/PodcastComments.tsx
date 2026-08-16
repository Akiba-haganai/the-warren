// src/components/podcast/PodcastComments.tsx
import { useState } from "react";
import { MessageSquare, Send, Clock } from "lucide-react";
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

export function PodcastComments({ episodeId, currentTime, onSeek }: PodcastCommentsProps) {
  const [comments, setComments] = useState<EpisodeComment[]>([
    {
      id: "c1",
      episodeId,
      authorName: "Alex M.",
      content: "This ecosystem breakdown is incredible! Loved the points at 02:15.",
      timestampSeconds: 135,
      createdAt: "2 hours ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const entry: EpisodeComment = {
      id: `c_${Date.now()}`,
      episodeId,
      authorName: "Anonymous Student",
      content: newComment.trim(),
      timestampSeconds: includeTimestamp ? Math.floor(currentTime) : undefined,
      createdAt: "Just now",
    };

    setComments((prev) => [entry, ...prev]);
    setNewComment("");
    toast.success("Comment added!");
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
      <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
        <Input
          placeholder={
            includeTimestamp
              ? `Add a comment pinned at @${formatTime(currentTime)}...`
              : "Add a comment..."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="rounded-full text-xs flex-1 bg-muted/50"
        />
        <Button type="submit" size="sm" className="rounded-full gap-1.5 shrink-0 bg-[#FF6D00] text-white">
          <Send className="h-3.5 w-3.5" /> Post
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {comments.map((c) => (
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
        ))}
      </div>
    </div>
  );
}
