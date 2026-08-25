import { useState, useCallback } from "react";
import { Link2, Share2, Check, MessageCircle, Send } from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
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

  const origin = typeof window !== "undefined" ? window.location.origin : "https://warren-wave.vercel.app";
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
    `📰 ${title}\n\n${typeof excerpt === "string" && excerpt ? excerpt : ""}\n\n${url}`
  );
  
  const whatsappStatusMsg = encodeURIComponent(
    `📰 ${title}\n\n${typeof excerpt === "string" && excerpt ? excerpt : ""}\n\n${strippedUrl}`
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
              <FacebookIcon className="h-5 w-5 text-[#1877F2] shrink-0" />
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
                <InstagramIcon className="h-5 w-5 text-[#cc2366] shrink-0" />
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
