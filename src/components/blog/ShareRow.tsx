import { useState, useCallback } from "react";
import { Link2, Share2, Check } from "lucide-react";

// ─── Platform SVG icons ───────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShareRowProps {
  title: string;
  excerpt?: string;
  slug: string;
  compact?: boolean;
}

// ─── Share button config ──────────────────────────────────────────────────────

interface ShareTarget {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  glowColor: string;
  action: (props: { url: string; title: string; excerpt: string }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShareRow({ title, excerpt = "", slug, compact = false }: ShareRowProps) {
  const [copied, setCopied] = useState<"link" | "instagram" | null>(null);
  const [igTooltip, setIgTooltip] = useState(false);

  const url = `https://the-warren-hub.vercel.app/blogs/${slug}`;

  const handleCopy = useCallback(
    async (text: string, type: "link" | "instagram") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        if (type === "instagram") setIgTooltip(true);
        setTimeout(() => {
          setCopied(null);
          setIgTooltip(false);
        }, 2200);
      } catch {
        // Fallback for browsers that block clipboard without interaction
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

  const whatsappMessage = encodeURIComponent(
    `📰 New story from your campus\n\n"${title}"\n${typeof excerpt === "string" && excerpt ? excerpt.slice(0, 120) + "…" : ""}\n\nRead here → ${url}`
  );

  const instagramCaption = `New read just dropped 🔥\n"${title}"\n\nLink in bio → the-warren-hub.vercel.app`;

  const shareTargets: ShareTarget[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1ebe5d]",
      glowColor: "shadow-[#25D366]/40",
      action: () =>
        window.open(`https://wa.me/?text=${whatsappMessage}`, "_blank"),
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0d6ce0]",
      glowColor: "shadow-[#1877F2]/40",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      id: "instagram",
      label: "Instagram",
      icon:
        copied === "instagram" ? (
          <Check className="h-[18px] w-[18px]" />
        ) : (
          <InstagramIcon />
        ),
      color:
        "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
      hoverColor: "hover:opacity-90",
      glowColor: "shadow-[#e6683c]/40",
      action: () => handleCopy(instagramCaption, "instagram"),
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed — no action needed
      }
    }
  };

  const hasNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className={compact ? "flex items-center gap-2" : "my-8"}>
      {/* Label */}
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Share this story
        </p>
      )}

      {/* Button row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Platform buttons */}
        {shareTargets.map((target) => (
          <div key={target.id} className="relative">
            <button
              id={`share-${target.id}`}
              onClick={() =>
                target.action({ url, title, excerpt })
              }
              aria-label={`Share on ${target.label}`}
              className={
                compact
                  ? `group relative flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground hover:text-white transition-colors duration-200 ${target.hoverColor}`
                  : `group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${target.color} ${target.hoverColor} shadow-lg ${target.glowColor} active:scale-95 transition-all duration-200`
              }
            >
              {/* Shimmer on hover (only for non-compact) */}
              {!compact && (
                <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </span>
              )}
              {target.icon}
              {!compact && <span>{target.label}</span>}
            </button>

            {/* Instagram tooltip — appears after copy */}
            {target.id === "instagram" && igTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-popover border border-border text-popover-foreground text-xs px-3 py-1.5 shadow-xl pointer-events-none z-10">
                Caption copied — paste it in your post!
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        {!compact && <div className="h-8 w-px bg-border hidden sm:block" />}

        {/* Copy link */}
        <button
          id="share-copy-link"
          onClick={() => handleCopy(url, "link")}
          aria-label="Copy blog link"
          className={
            compact
              ? "group relative flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
              : "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-secondary hover:bg-accent text-secondary-foreground border border-border active:scale-95 transition-all duration-200"
          }
        >
          {copied === "link" ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              {!compact && <span className="text-green-600 dark:text-green-400">Copied!</span>}
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              {!compact && <span>Copy link</span>}
            </>
          )}
        </button>

        {/* Native share — only shown when the API is available (mobile) */}
        {hasNativeShare && (
          <button
            id="share-native"
            onClick={handleNativeShare}
            aria-label="Share via device"
            className={
              compact
                ? "group relative flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                : "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all duration-200"
            }
          >
            <Share2 className="h-4 w-4" />
            {!compact && <span>More</span>}
          </button>
        )}
      </div>
    </div>
  );
}
