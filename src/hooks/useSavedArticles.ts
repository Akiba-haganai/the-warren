import { useState, useEffect } from "react";

const SAVED_KEY = "weave:saved_articles";

export interface SavedArticle {
  slug: string;
  title: string;
  excerpt?: string;
  authorName?: string;
  publishedAt?: string;
  savedAt: string;
}

function getAll(): SavedArticle[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(articles: SavedArticle[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(articles));
  } catch {}
}

export function useSavedArticles() {
  const [saved, setSaved] = useState<SavedArticle[]>([]);

  useEffect(() => {
    setSaved(getAll());
  }, []);

  const isSaved = (slug: string) => saved.some((a) => a.slug === slug);

  const toggleSave = (article: Omit<SavedArticle, "savedAt">) => {
    const all = getAll();
    const exists = all.findIndex((a) => a.slug === article.slug);

    if (exists !== -1) {
      const updated = all.filter((a) => a.slug !== article.slug);
      saveAll(updated);
      setSaved(updated);
    } else {
      const updated = [{ ...article, savedAt: new Date().toISOString() }, ...all];
      saveAll(updated);
      setSaved(updated);
    }
  };

  const clearAll = () => {
    saveAll([]);
    setSaved([]);
  };

  return { saved, isSaved, toggleSave, clearAll };
}
