import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import warrenLogo from "@/assets/warren_logo.png";

export function InstallPWA() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Stagger entrance — wait 2 s after the prompt is available so it doesn't
  // pop up the instant the page loads
  useEffect(() => {
    if (!canInstall || dismissed) return;
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [canInstall, dismissed]);

  const handleInstall = async () => {
    await promptInstall();
    setDismissed(true);
  };

  const handleDismiss = () => {
    setVisible(false);
    // Give the exit animation time to finish before removing from DOM
    setTimeout(() => setDismissed(true), 400);
  };

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Install Warren app"
      style={{
        // CSS custom-property animation driven by `visible` flag
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease",
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100vw-2rem)] max-w-sm"
    >
      {/* Glow halo behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-xl pointer-events-none" />

      {/* Main card */}
      <div className="relative rounded-2xl border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden">

        {/* Shimmer strip across the top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />

        <div className="relative flex items-center gap-4 px-5 py-4">
          {/* App icon */}
          <div className="shrink-0 h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
            <img
              src={warrenLogo}
              alt="Warren"
              className="h-7 w-7 object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              Install Warren
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fast, offline-ready &amp; always up to date
            </p>

            {/* Badges row */}
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300">
                <Smartphone className="h-2.5 w-2.5" /> Works offline
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
                Free
              </span>
            </div>
          </div>

          {/* Install button */}
          <button
            onClick={handleInstall}
            aria-label="Install app"
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition-all duration-200"
          >
            <Download className="h-3.5 w-3.5" />
            Install
          </button>
        </div>

        {/* Bottom shimmer strip */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Dismiss X — sits outside / above card so it doesn't shrink */}
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
