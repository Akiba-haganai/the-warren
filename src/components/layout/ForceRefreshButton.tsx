import { useState } from "react";

export function ForceRefreshButton() {
  const [status, setStatus] = useState<"idle" | "clearing" | "done">("idle");

  async function handleForceRefresh() {
    setStatus("clearing");
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      setStatus("done");
      // Small delay so the "done" state is visible before reload
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      console.error("Force refresh failed:", err);
      setStatus("idle");
      window.location.reload(); // fallback: reload anyway
    }
  }

  return (
    <div className="border-t border-border pt-6 mt-6">
      <h3 className="font-display text-lg font-semibold text-foreground">Troubleshooting</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl">
        If the app seems stuck on an old version or photos aren't loading properly, force-clear the local cache and reload.
      </p>
      <button
        onClick={handleForceRefresh}
        disabled={status !== "idle"}
        className="mt-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 text-sm font-semibold disabled:opacity-50 transition-colors"
      >
        {status === "idle" && "Force Refresh App"}
        {status === "clearing" && "Clearing cache…"}
        {status === "done" && "Reloading…"}
      </button>
    </div>
  );
}
