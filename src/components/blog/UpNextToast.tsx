import { Link } from "react-router-dom";
import type { BlogCardProps } from "./BlogCard";
import { urlForImage } from "@/lib/sanityImage";
import { ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface UpNextToastProps {
  blog: BlogCardProps;
  visible: boolean;
  onDismiss: () => void;
}

export function UpNextToast({ blog, visible, onDismiss }: UpNextToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  if (!mounted) return null;

  const imageUrl = blog.mainImage
    ? urlForImage(blog.mainImage as any).width(120).height(120).fit("crop").auto("format").quality(75).url()
    : null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 max-w-[340px] bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 transition-all duration-500 ease-out transform origin-bottom-right",
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
      )}
      onTransitionEnd={() => {
        if (!visible) setMounted(false);
      }}
    >
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      
      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
        Up Next
      </p>
      
      <Link 
        to={`/blog/${blog.slug}`} 
        className="group flex gap-3 items-center"
        onClick={onDismiss} // Auto dismiss when navigating
      >
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={blog.title} 
            width={120}
            height={120}
            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-muted"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-medium text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h4>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors shrink-0" />
      </Link>
    </div>
  );
}
