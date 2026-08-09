import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration?.update().catch(() => {});
        }
      });
      // Fallback polling (mostly for Android, as iOS suspends this)
      setInterval(() => registration?.update().catch(() => {}), 60_000);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast("Commons updated — refreshing…", {
        duration: 2000,
        action: {
          label: "Trouble updating? →",
          onClick: () => {
            // Usually this clicks through to the About page automatically if they intercept it in time,
            // but the timeout will force a reload shortly anyway.
            window.location.href = "/about";
          },
        },
      });
      setTimeout(() => updateServiceWorker(true), 1500);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
