import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useVersionCheck } from "@/hooks/useVersionCheck";

/**
 * UpdatePrompt
 *
 * Renders nothing visually — works entirely through Sonner toasts.
 * Shows a persistent "Update ready" toast whenever a new Service Worker
 * is waiting or a new version is detected. The user must tap it to reload —
 * we never auto-reload silently, which prevents mid-session chunk-mismatch crashes.
 */
export function UpdatePrompt() {
  const { updateReady, isStale, applyUpdate } = useVersionCheck();
  const [promptDismissed, setPromptDismissed] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    // If an update is detected and not actively dismissed in this cycle:
    if ((updateReady || isStale) && !promptDismissed) {
      toastIdRef.current = toast("✨ Weave update ready", {
        description: "A new version is available.",
        duration: Infinity, // persist until user acts
        action: {
          label: "Refresh now",
          onClick: applyUpdate,
        },
        onDismiss: () => {
          setPromptDismissed(true);
        },
      });
    }
  }, [updateReady, isStale, promptDismissed, applyUpdate]);

  // If user switches back to the tab, re-check whether prompt should appear
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setPromptDismissed(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
