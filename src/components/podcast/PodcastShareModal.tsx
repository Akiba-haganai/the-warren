import { useState, useCallback } from "react";
import { Link2, Share2, Check, MessageCircle, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Episode } from "@/data/podcasts";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface PodcastShareModalProps {
  episode: Episode;
  trigger?: React.ReactNode;
}

export function PodcastShareModal({ episode, trigger }: PodcastShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://warren-wave.vercel.app";
  const url = `${origin}/podcasts?episode=${episode.id}`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${episode.youtubeId}`;
  const strippedUrl = url.replace(/^https?:\/\//, "");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [url]);

  const whatsappStatusMsg = encodeURIComponent(
    `🎙️ Listen to "${episode.title}" on WAVE\n\n${episode.description ? episode.description.slice(0, 100) + "..." : ""}\n\n${strippedUrl}`
  );

  const whatsappChatMsg = encodeURIComponent(
    `🎙️ "${episode.title}"\n\nListen on WAVE: ${url}`
  );

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: episode.title,
          text: episode.description,
          url,
        });
      } catch {}
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Share podcast">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Podcast Episode</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-3">
          <div className="flex items-center space-x-2">
            <Input readOnly value={url} className="flex-1 text-sm bg-muted/50" />
            <Button size="sm" onClick={handleCopy} className="shrink-0 gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            <a
              href={`https://wa.me/?text=${whatsappStatusMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-emerald-500/10 hover:border-emerald-500/30 transition text-left group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block">Share to WhatsApp Status</span>
                <span className="text-xs text-muted-foreground">Post thumbnail link to your WhatsApp status</span>
              </div>
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${whatsappChatMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-green-500/10 hover:border-green-500/30 transition text-left group"
            >
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block">Send via WhatsApp Chat</span>
                <span className="text-xs text-muted-foreground">Directly message friends or campus groups</span>
              </div>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-blue-500/10 hover:border-blue-500/30 transition text-left group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                <FacebookIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block">Post to Facebook</span>
                <span className="text-xs text-muted-foreground">Share to timeline or student groups</span>
              </div>
            </a>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-red-500/10 hover:border-red-500/30 transition text-left group"
            >
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block">Watch / Play on YouTube</span>
                <span className="text-xs text-muted-foreground">Open in YouTube app for background playback</span>
              </div>
            </a>

            {typeof navigator !== "undefined" && !!navigator.share && (
              <Button variant="outline" onClick={handleNativeShare} className="w-full justify-center gap-2 mt-1">
                <Share2 className="h-4 w-4" />
                More Sharing Options...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
