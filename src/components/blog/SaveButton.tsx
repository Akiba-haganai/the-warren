import { useSavedArticles } from "@/hooks/useSavedArticles";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SaveButtonProps {
  slug: string;
  title: string;
  excerpt?: string;
  authorName?: string;
  publishedAt?: string;
}

export function SaveButton({ slug, title, excerpt, authorName, publishedAt }: SaveButtonProps) {
  const { isSaved, toggleSave } = useSavedArticles();
  const saved = isSaved(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation if wrapped in anchor
    e.stopPropagation();
    toggleSave({ slug, title, excerpt, authorName, publishedAt });
    toast(saved ? "Removed from saved articles" : "Saved for later", {
      icon: saved ? "🗑️" : "🔖",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      className={`h-8 w-8 rounded-full transition-colors ${
        saved
          ? "text-blue-600 bg-blue-500/10 hover:bg-blue-500/20"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  );
}
