import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPWA() {
  const { canInstall, isIOS, isStandalone, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in localStorage within last 3 days
    try {
      const lastDismissed = localStorage.getItem("weave_pwa_dismissed");
      if (lastDismissed) {
        const diff = Date.now() - parseInt(lastDismissed, 10);
        if (diff < 3 * 24 * 60 * 60 * 1000) {
          setDismissed(true);
          return;
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!canInstall || dismissed || isStandalone) return;
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [canInstall, dismissed, isStandalone]);

  const handleInstall = async () => {
    if (isIOS) {
      alert("To install WEAVE on iOS:\n1. Tap the Share button in Safari\n2. Scroll down and tap 'Add to Home Screen'");
      return;
    }
    await promptInstall();
    setDismissed(true);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
      try {
        localStorage.setItem("weave_pwa_dismissed", Date.now().toString());
      } catch {}
    }, 400);
  };

  if (!canInstall || dismissed || isStandalone) return null;

  return (
    <div
      role="dialog"
      aria-label="Install WEAVE app"
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease",
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100vw-2rem)] max-w-sm"
    >
      {/* Glow halo behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-30 blur-xl pointer-events-none" />

      {/* Main card */}
      <div className="relative rounded-2xl border border-white/20 bg-card/90 backdrop-blur-2xl shadow-2xl overflow-hidden p-4">
        {/* Shimmer strip across the top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

        <div className="relative flex items-center gap-3.5">
          {/* App icon */}
          <div className="shrink-0 h-12 w-12 rounded-xl bg-[#FF6D00] flex items-center justify-center shadow-lg shadow-orange-600/30 overflow-hidden">
            <img
              src="/icon-192.png"
              alt="WEAVE"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              Install WEAVE
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isIOS ? "Tap Share → Add to Home Screen" : "Fast, offline-ready & always up to date"}
            </p>

            {/* Badges row */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                <Smartphone className="h-2.5 w-2.5" /> PWA App
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Free
              </span>
            </div>
          </div>

          {/* Install button */}
          <button
            onClick={handleInstall}
            aria-label="Install app"
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#FF6D00] hover:bg-orange-600 active:scale-95 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-600/30 transition-all duration-200"
          >
            {isIOS ? <Share className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
            {isIOS ? "How-To" : "Install"}
          </button>
        </div>

        {/* Bottom shimmer strip */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Dismiss X button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow transition"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
