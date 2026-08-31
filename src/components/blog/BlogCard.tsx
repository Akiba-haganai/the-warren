import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/lib/sanityImage";
import { Heart } from "lucide-react";

export interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  author: {
    name: string;
    image?: any;
    slug: string;
  };
  mainImage?: unknown;
  publishedAt?: string;
  topic?: { _id: string; title: string; slug: string };
  likeCount?: number;
}

export function BlogCard({ blog }: { blog: BlogCardProps }) {
  const coverSrc = blog.mainImage
    ? (() => {
        try {
          return urlForImage(blog.mainImage as Parameters<typeof urlForImage>[0])
            .width(600)
            .height(338)
            .fit("crop")
            .auto("format")
            .quality(75)
            .url();
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <Link to={`/blogs/${blog.slug}`} className="block h-full group">
      <Card className="overflow-hidden border-border bg-card hover:shadow-glow transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
        <div className="aspect-video w-full relative overflow-hidden bg-muted">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={blog.title}
              width={600}
              height={338}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-display transition-transform duration-500 group-hover:scale-105">
              W
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          {blog.topic && (
            <Badge className="mb-2 text-xs w-fit bg-secondary/80 hover:bg-secondary">
              {blog.topic.title}
            </Badge>
          )}
          <h3 className="font-semibold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {blog.excerpt}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="text-foreground">{blog.author?.name || "Warren Team"}</span>
              {blog.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              )}
            </p>
            {blog.likeCount != null && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3 w-3" />
                {blog.likeCount}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
