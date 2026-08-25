import { useRebrandNotice } from "@/hooks/useRebrandNotice";

export function RebrandBanner() {
  const { showBanner, dismiss } = useRebrandNotice();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border bg-foreground text-background p-4 shadow-2xl flex items-start gap-4 animate-in slide-in-from-bottom-6">
      <div className="flex-1 text-sm">
        <p className="font-semibold text-base">We've renamed to WAVE 🎉</p>
        <p className="text-background/80 mt-1 leading-relaxed">
          Your home screen icon still shows the old name. Remove it and add
          WAVE again to get the new icon and name.
        </p>
      </div>
      <button
        onClick={dismiss}
        className="text-background/70 hover:text-background font-medium text-sm shrink-0 mt-1 transition"
      >
        Got it
      </button>
    </div>
  );
}
