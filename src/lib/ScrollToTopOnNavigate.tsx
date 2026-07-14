import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Ensure we start at top even on first load (catches browser scroll restoration)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}