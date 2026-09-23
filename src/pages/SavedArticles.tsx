import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Link } from "react-router-dom";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight, Trash2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function SavedArticles() {
  const { saved, toggleSave, clearAll } = useSavedArticles();

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-background min-h-screen">
        <section className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionLabel>Reading List</SectionLabel>
            <div className="flex items-center justify-between mt-4 mb-8">
              <h1 className="font-display text-4xl font-semibold">Saved Articles</h1>
              {saved.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-destructive gap-1.5"
                >
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              )}
            </div>
          </Reveal>

          {saved.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 space-y-4">
                <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-lg font-medium">Nothing saved yet</p>
                <p className="text-muted-foreground">
                  Tap the bookmark icon on any blog to save it for later — no account needed.
                </p>
                <Button asChild className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/blogs">Browse Blogs <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-4">
              {saved.map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.05}>
                  <Card className="border-border bg-card hover:shadow-md transition-all group">
                    <CardContent className="p-5 flex items-start justify-between gap-4">
                      <Link to={`/blogs/${article.slug}`} className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {article.authorName && <span>{article.authorName} · </span>}
                          Saved {timeAgo(article.savedAt)}
                        </p>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(article)}
                        aria-label="Remove from saved"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
