import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCampus } from "@/contexts/CampusContext";
import Home from "./Home";

export default function CampusPage() {
  const { slug } = useParams<{ slug: string }>();
  const { setCampusContext } = useCampus();

  useEffect(() => {
    if (slug) {
      // Create a readable name from slug (e.g. "copperbelt-university" -> "Copperbelt University")
      // In a production scenario, you might fetch the actual name from Sanity here.
      const formattedName = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
        
      setCampusContext({
        scope: "university",
        universitySlug: slug,
        universityName: formattedName
      });
    }
  }, [slug, setCampusContext]);

  return <Home />;
}
