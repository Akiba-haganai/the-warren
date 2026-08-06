import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";
import { useState } from "react";

export function UpdatePrompt() {
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      if (registration) {
        // Poll every 60 seconds so open tabs detect new deploys quickly
        setInterval(() => registration.update(), 60_000);
      }
    },
  });


  if (!needRefresh || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-border bg-background/95 backdrop-blur-md px-5 py-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-blue-600 shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">
          A new version is available
        </span>
      </div>
      <button
        onClick={() => updateServiceWorker(true)}
        className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 transition px-3.5 py-1.5 text-xs font-semibold text-white shrink-0"
      >
        <RefreshCw className="h-3 w-3" /> Update now
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground transition rounded-full p-1"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
