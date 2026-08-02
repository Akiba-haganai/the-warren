import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function LegacyAnchorRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user lands on '/' with an anchor hash that belongs to old home sections
    if (location.pathname === "/" && location.hash) {
      const legacyHashes = [
        "#our-apps",
        "#why-warren",
        "#community",
        "#timeline",
        "#ecosystem",
        "#showcase",
        "#podcasts",
        "#founder",
        "#values",
        "#roadmap",
        "#stats",
      ];
      if (legacyHashes.includes(location.hash)) {
        navigate(`/explore${location.hash}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
}
