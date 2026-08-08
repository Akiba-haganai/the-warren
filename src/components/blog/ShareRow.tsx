import { useState, useCallback } from "react";
import { Link2, Share2, Check, MessageCircle, Send, Instagram, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareRowProps {
  title: string;
  excerpt?: string;
  slug: string;
  compact?: boolean;
}

export function ShareRow({ title, excerpt = "", slug, compact = false }: ShareRowProps) {
  const [copied, setCopied] = useState<"link" | "instagram" | null>(null);
  const [open, setOpen] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://the-warren-hub.vercel.app";
  const url = `${origin}/blogs/${slug}`;
  const strippedUrl = url.replace(/^https?:\/\//, "");

  const handleCopy = useCallback(
    async (text: string, type: "link" | "instagram") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2200);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(type);
        setTimeout(() => setCopied(null), 2200);
      }
    },
    []
  );

  const whatsappChatMsg = encodeURIComponent(
    `📰 New story from your campus\n\n"${title}"\n${typeof excerpt === "string" && excerpt ? excerpt.slice(0, 120) + "…" : ""}\n\nRead here → ${url}`
  );
  
  const whatsappStatusMsg = encodeURIComponent(
    `📰 ${title}\n\nRead here → ${strippedUrl}`
  );

  const instagramCaption = `New read just dropped 🔥\n"${title}"\n\nLink in bio → ${strippedUrl}`;

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={
            compact
              ? "group relative flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
              : "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-secondary hover:bg-accent text-secondary-foreground border border-border active:scale-95 transition-all duration-200"
          }
        >
          <Share2 className="h-4 w-4" />
          {!compact && <span>Share</span>}
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this story</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Input readOnly value={url} className="flex-1 text-sm bg-muted/50" />
            <Button size="sm" onClick={() => handleCopy(url, "link")} className="px-3 shrink-0">
              <span className="sr-only">Copy</span>
              {copied === "link" ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-start gap-3 h-14 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 dark:bg-[#25D366]/5 dark:hover:bg-[#25D366]/15"
              onClick={() => window.open(`https://wa.me/?text=${whatsappChatMsg}`, "_blank")}
            >
              <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-semibold text-sm truncate w-full text-left">WhatsApp Chat</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-left">Rich preview card</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-start gap-3 h-14 bg-[#128C7E]/10 hover:bg-[#128C7E]/20 border-[#128C7E]/30 dark:bg-[#128C7E]/5 dark:hover:bg-[#128C7E]/15"
              onClick={() => window.open(`https://wa.me/?text=${whatsappStatusMsg}`, "_blank")}
            >
              <Send className="h-5 w-5 text-[#128C7E] shrink-0" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-semibold text-sm truncate w-full text-left">WhatsApp Status</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-left">Clickable text link</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-start gap-3 h-14 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 dark:bg-[#1877F2]/5 dark:hover:bg-[#1877F2]/15"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
            >
              <Facebook className="h-5 w-5 text-[#1877F2] shrink-0" />
              <span className="font-semibold text-sm">Facebook</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-start gap-3 h-14 bg-gradient-to-br from-[#f09433]/10 via-[#dc2743]/10 to-[#bc1888]/10 hover:opacity-80 border-[#dc2743]/30 dark:from-[#f09433]/5 dark:via-[#dc2743]/5 dark:to-[#bc1888]/5 relative"
              onClick={() => handleCopy(instagramCaption, "instagram")}
            >
              {copied === "instagram" ? (
                <Check className="h-5 w-5 text-[#cc2366] shrink-0" />
              ) : (
                <Instagram className="h-5 w-5 text-[#cc2366] shrink-0" />
              )}
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-semibold text-sm truncate w-full text-left">{copied === "instagram" ? "Caption Copied!" : "Instagram"}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-left">Copies caption for post</span>
              </div>
            </Button>

            {hasNativeShare && (
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-3 h-14 sm:col-span-2"
                onClick={handleNativeShare}
              >
                <Share2 className="h-5 w-5 shrink-0" />
                <span className="font-semibold text-sm">More Options (Native Share)</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
