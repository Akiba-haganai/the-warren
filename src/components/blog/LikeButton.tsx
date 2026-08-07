import { useBlogLikes } from "@/hooks/useBlogLikes";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  blogSlug: string;
}

export function LikeButton({ blogSlug }: LikeButtonProps) {
  const { likeCount, liked, toggleLike, loading, isToggling } = useBlogLikes(blogSlug);

  return (
    <button
      id="blog-like-button"
      onClick={toggleLike}
      disabled={loading || isToggling}
      aria-label={liked ? "Unlike this blog" : "Like this blog"}
      className={`
        group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5
        text-sm font-semibold select-none
        border transition-all duration-200 active:scale-95
        ${
          liked
            ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
            : "bg-secondary border-border text-secondary-foreground hover:bg-accent"
        }
      `}
    >
      {/* Shimmer on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </span>

      <Heart
        className={`h-[18px] w-[18px] transition-all duration-300 ${
          liked ? "fill-red-500 text-red-500 scale-110" : "fill-none"
        }`}
        style={{
          filter: liked ? "drop-shadow(0 0 6px rgba(239,68,68,0.4))" : "none",
        }}
      />
      <span>{likeCount}</span>
    </button>
  );
}
