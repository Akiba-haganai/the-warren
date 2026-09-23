import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanityImage";

import YouTube from "react-youtube";

function getYouTubeId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match?.[1];
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlForImage(value).width(800).auto("format").url()}
        alt={value.alt || ""}
        className="rounded-lg my-6 w-full shadow-md"
        loading="lazy"
      />
    ),
    youtube: ({ value }) => {
      const id = getYouTubeId(value.url);
      if (!id) return null;
      return (
        <div className="my-8">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
            <YouTube
              videoId={id}
              opts={{
                width: "100%",
                height: "100%",
                host: "https://www.youtube-nocookie.com",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                  modestbranding: 1,
                  playsinline: 1,
                  enablejsapi: 1,
                  rel: 0,
                  iv_load_policy: 3,
                  origin: typeof window !== "undefined" ? window.location.origin : undefined,
                },
              }}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
};

export function StoryBody({ value }: { value: unknown }) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose prose-p:text-[17px] dark:prose-p:text-slate-300 prose-headings:font-display prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
