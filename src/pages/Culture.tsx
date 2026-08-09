import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";
import { useCulturePhotos } from "@/hooks/useCulturePhotos";
import { urlForImage } from "@/lib/sanityImage";

export default function Culture() {
  const { photos, loading } = useCulturePhotos();

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
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

          <div className="mt-12">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <p className="text-muted-foreground text-center py-24">
                No photos yet. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo, i) => (
                  <Reveal key={photo._id} delay={(i % 8) * 0.04}>
                    <figure className="group relative overflow-hidden rounded-xl">
                      <img
                        src={urlForImage(photo.image).width(600).height(600).fit("crop").url()}
                        alt={photo.caption || "CBU culture"}
                        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {photo.caption && (
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white opacity-0 transition group-hover:opacity-100">
                          {photo.caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
