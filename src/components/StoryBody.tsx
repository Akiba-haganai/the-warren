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
    <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose prose-p:text-[17px] dark:prose-p:text-slate-300 prose-headings:font-display prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
