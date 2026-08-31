import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal, SectionLabel } from "@/components/layout/Reveal";
import { ArrowLeft } from "lucide-react";
import { useAuthorBlogs } from "@/hooks/useAuthorBlogs";
import { BlogCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { sanityClient } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanityImage";

interface AuthorDetails {
  name: string;
  image?: any;
  bio?: string;
}

export default function AuthorPage() {
  const { name: authorSlug } = useParams<{ name: string }>();
  const decodedSlug = authorSlug ? decodeURIComponent(authorSlug) : "";
  const { blogs, loading: blogsLoading } = useAuthorBlogs(decodedSlug);

  const [authorProfile, setAuthorProfile] = useState<AuthorDetails | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!decodedSlug) {
      setProfileLoading(false);
      return;
    }
    let active = true;
    setProfileLoading(true);

    sanityClient
      .fetch<AuthorDetails | null>(
        `*[_type == "author" && slug.current == $slug][0] { name, image, bio }`,
        { slug: decodedSlug }
      )
      .then((data) => {
        if (active) {
          setAuthorProfile(data);
          setProfileLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch author profile:", err);
        if (active) {
          setProfileLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [decodedSlug]);

  const loading = blogsLoading || profileLoading;
  const displayName = authorProfile?.name || blogs[0]?.author.name || decodedSlug.replace(/-/g, " ");

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        {/* Hero banner */}
        <section className="bg-muted/30 border-b -mt-8 mb-12">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center flex flex-col items-center">
            <Reveal>
              <div className="flex justify-center mb-6">
                {authorProfile?.image ? (
                  <img
                    src={urlForImage(authorProfile.image).width(160).height(160).fit("crop").auto("format").quality(75).url()}
                    alt={displayName}
                    width={160}
                    height={160}
                    className="h-24 w-24 rounded-full object-cover border-2 border-border shadow-md"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center font-display text-3xl font-semibold uppercase">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              
              <SectionLabel>Author</SectionLabel>
              
              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                {displayName}
              </h1>
              
              {authorProfile?.bio && (
                <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
                  {authorProfile.bio}
                </p>
              )}

              {!loading && (
                <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
                </p>
              )}
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All Blogs
          </Link>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-2xl" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium">No blogs found for this author.</p>
              <p className="text-muted-foreground mt-2">This author hasn't published any blogs yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <Reveal key={blog.id} delay={i * 0.05}>
                  <BlogCard blog={blog} />
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
