import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Camera, X, Maximize2, Sparkles, Filter } from "lucide-react";
import { useCulturePhotos, type CulturePhoto } from "@/hooks/useCulturePhotos";
import { urlForImage } from "@/lib/sanityImage";

const CATEGORIES = [
  "All",
  "Campus Life",
  "Events",
  "Faith & Community",
  "People",
  "Academics",
  "Sports & Recreation",
] as const;

export default function Culture() {
  const { photos, loading } = useCulturePhotos();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<CulturePhoto | null>(null);

  // Compute category counts cleanly from single source of truth
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: photos.length };
    for (const photo of photos) {
      if (photo.category) {
        counts[photo.category] = (counts[photo.category] || 0) + 1;
      }
    }
    return counts;
  }, [photos]);

  // Filter photos based on active category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "All") return photos;
    return photos.filter((p) => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        <section className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionLabel>See</SectionLabel>
            <div className="flex items-center gap-2 mt-2">
              <Camera className="h-6 w-6 text-blue-600" />
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                CBU Culture
              </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Real moments from campus — submitted and captured by CBU students.
            </p>
          </Reveal>

          {/* Category Filter Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">
              <Filter className="h-3.5 w-3.5 mr-1 text-blue-600" /> Categories:
            </div>
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-glow scale-105"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Photo Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-2xl" />
                ))}
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="text-center py-24 rounded-3xl border border-dashed border-border bg-muted/20">
                <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm font-medium">
                  {selectedCategory === "All"
                    ? "No photos uploaded yet. Check back soon!"
                    : `No photos found in "${selectedCategory}".`}
                </p>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="mt-3 text-xs text-blue-600 underline font-medium"
                  >
                    View all photos
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, i) => (
                  <Reveal key={photo._id} delay={(i % 8) * 0.04}>
                    <figure
                      onClick={() => setActivePhoto(photo)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted/40 aspect-square shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                    >
                      <img
                        src={urlForImage(photo.image).width(600).height(600).fit("crop").url()}
                        alt={photo.caption || "CBU culture photo"}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          {photo.category && (
                            <Badge className="bg-blue-600/80 backdrop-blur-md text-[10px] text-white border-none">
                              {photo.category}
                            </Badge>
                          )}
                          <div className="p-1.5 rounded-full bg-white/20 text-white backdrop-blur-md ml-auto">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {photo.caption && (
                          <figcaption className="text-xs text-white/90 font-medium line-clamp-2">
                            {photo.caption}
                          </figcaption>
                        )}
                      </div>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Interactive Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Close photo"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={urlForImage(activePhoto.image).width(1200).fit("max").url()}
              alt={activePhoto.caption || "CBU Culture"}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {(activePhoto.caption || activePhoto.category) && (
              <div className="mt-4 text-center space-y-1 max-w-xl">
                {activePhoto.category && (
                  <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-400">
                    {activePhoto.category}
                  </Badge>
                )}
                {activePhoto.caption && (
                  <p className="text-sm text-white/90 font-medium">{activePhoto.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
