import { useCampus } from "@/contexts/CampusContext";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// In a full implementation, this could be fetched from Sanity.
// Hardcoded here for the initial personalization layer.
const UNIVERSITIES = [
  { slug: "cbu", name: "Copperbelt University" },
  { slug: "unza", name: "University of Zambia" },
  { slug: "mulungushi", name: "Mulungushi University" },
  { slug: "zcas", name: "ZCAS University" },
];

export function CampusSelector() {
  const { scope, universityName, setCampusContext, resetToNational } = useCampus();

  const handleSelectUniversity = (slug: string, name: string) => {
    setCampusContext({
      scope: "university",
      universitySlug: slug,
      universityName: name,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline-block text-xs font-medium">
            {scope === "national" ? "All Zambia" : universityName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Campus</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={resetToNational}
          className={scope === "national" ? "bg-accent" : ""}
        >
          All Zambia (National)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {UNIVERSITIES.map((uni) => (
          <DropdownMenuItem
            key={uni.slug}
            onClick={() => handleSelectUniversity(uni.slug, uni.name)}
            className={scope === "university" && universityName === uni.name ? "bg-accent" : ""}
          >
            {uni.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
