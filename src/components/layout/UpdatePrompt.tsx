import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useVersionCheck } from "@/hooks/useVersionCheck";

/**
 * UpdatePrompt
 *
 * Renders nothing visually — works entirely through Sonner toasts.
 * Shows a persistent "Update available" toast whenever a new Service Worker
 * is waiting. The user must tap it to reload — we never auto-reload silently,
 * which prevents the mid-session chunk-mismatch crash.
 */
export function UpdatePrompt() {
  const { updateReady, isStale, applyUpdate } = useVersionCheck();
  const toastShownRef = useRef(false);

  useEffect(() => {
    // Only show the toast once, even if updateReady or isStale both fire
    if ((updateReady || isStale) && !toastShownRef.current) {
      toastShownRef.current = true;

      toast("✨ WAVE update ready", {
        description: "A new version is available.",
        duration: Infinity, // persist until user acts
        action: {
          label: "Refresh now",
          onClick: applyUpdate,
        },
        onDismiss: () => {
          // If dismissed, try again on next visibility change
          toastShownRef.current = false;
        },
      });
    }
  }, [updateReady, isStale, applyUpdate]);

  return null;
}
