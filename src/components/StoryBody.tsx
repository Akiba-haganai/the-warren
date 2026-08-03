import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanityImage";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlForImage(value).width(800).auto("format").url()}
        alt={value.alt || ""}
        className="rounded-lg my-6 w-full"
        loading="lazy"
      />
    ),
  },
};

export function StoryBody({ value }: { value: unknown }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
