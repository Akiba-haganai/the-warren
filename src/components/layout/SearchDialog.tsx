import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { urlForImage } from "@/lib/sanityImage";
import { useSanitySearch } from "@/hooks/useSanitySearch";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const nav = [
  { to: "/", label: "Media" },
  { to: "/blogs", label: "Blogs" },
  { to: "/podcasts", label: "Podcasts" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
}: SearchDialogProps) {
  const navigate = useNavigate();
  const { loading: searchLoading, stories, topics, debouncedQuery } = useSanitySearch(searchQuery);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search stories, topics, or pages..."
        value={searchQuery}
        onValueChange={onSearchQueryChange}
      />
      <CommandList>
        {searchLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}

        {!searchLoading && debouncedQuery.length > 0 && stories.length === 0 && topics.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {!searchLoading && debouncedQuery.length > 0 && (
          <>
            {stories.length > 0 && (
              <CommandGroup heading="Stories">
                {stories.map((story) => (
                  <CommandItem
                    key={story._id}
                    onSelect={() => {
                      navigate(`/blogs/${story.slug}`);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 py-2 cursor-pointer"
                  >
                    {story.mainImage && (
                      <img
                        src={urlForImage(story.mainImage).width(60).height(60).fit("crop").auto("format").quality(75).url()}
                        alt={story.title}
                        width={60}
                        height={60}
                        className="w-8 h-8 rounded object-cover shrink-0"
                      />
                    )}
                    <span className="line-clamp-1">{story.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {topics.length > 0 && (
              <CommandGroup heading="Topics">
                {topics.map((topic) => (
                  <CommandItem
                    key={topic._id}
                    onSelect={() => {
                      navigate(`/topics/${topic.slug}`);
                      onOpenChange(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    {topic.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}

        {!searchLoading && debouncedQuery.length === 0 && (
          <CommandGroup heading="Pages">
            {nav.map((n) => (
              <CommandItem
                key={n.to}
                onSelect={() => {
                  navigate(n.to);
                  onOpenChange(false);
                }}
                className="cursor-pointer"
              >
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
