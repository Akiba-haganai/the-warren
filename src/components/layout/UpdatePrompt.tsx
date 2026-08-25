import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Re-check for updates whenever user returns to the app / foregrounds on mobile
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration?.update().catch(() => {});
        }
      });
      // Fallback background check every 60 seconds
      setInterval(() => registration?.update().catch(() => {}), 60_000);
    },
  });

  useEffect(() => {
    // Listen for service worker controller replacement (autoUpdate takeover)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      let refreshing = false;
      const handleControllerChange = () => {
        if (refreshing) return;
        refreshing = true;
        toast("WAVE updated — refreshing...", { duration: 2000 });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      };

      navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      };
    }
  }, []);

  useEffect(() => {
    if (needRefresh) {
      toast("WAVE updated — refreshing...", {
        duration: 2000,
        action: {
          label: "Trouble updating? →",
          onClick: () => {
            window.location.href = "/about";
          },
        },
      });
      setTimeout(() => updateServiceWorker(true), 1200);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
