import { useCallback, useEffect, useRef, useState } from "react";
import { registerPWA, sendSkipWaiting } from "@/utils/pwa-register";

export interface PWAUpdateState {
  /** True when a new service worker is waiting and ready to activate. */
  updateReady: boolean;
  /** True when /version.json reports a SHA that differs from the running build. */
  isStale: boolean;
  /** Promote the waiting SW and reload the page. */
  applyUpdate: () => void;
}

/**
 * useVersionCheck
 *
 * Combines two update-detection strategies:
 *  1. SW lifecycle events (updatefound → installed → waiting) from pwa-register.ts
 *  2. Proactive polling of /version.json on visibility/focus/interval
 *
 * When stale is detected, calls registration.update() so the browser starts
 * downloading the new SW immediately without waiting for the 24-hour organic check.
 */
export function useVersionCheck(): PWAUpdateState {
  const [updateReady, setUpdateReady] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // ── Register the SW and wire up update callbacks ─────────────────────────
  useEffect(() => {
    registerPWA({
      onRegistered(reg) {
        registrationRef.current = reg;
      },
      onUpdateReady() {
        setUpdateReady(true);
      },
      onRegisterError(err) {
        console.warn("[WEAVE] SW registration error:", err);
      },
    });
  }, []);

  // ── Proactive version polling via /version.json ───────────────────────────
  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data: { version: string } = await res.json();
      const running = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : null;
      if (running && data.version !== running) {
        setIsStale(true);
        // Force the browser to fetch the new SW immediately
        registrationRef.current?.update().catch(() => {});
      }
    } catch {
      // Silently ignore — network may be offline, not worth surfacing
    }
  }, []);

  useEffect(() => {
    checkVersion(); // on mount

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Background heartbeat every 5 minutes for long-lived tabs
    const interval = setInterval(checkVersion, 5 * 60_000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [checkVersion]);

  // ── Apply update: promote waiting SW → controllerchange → reload ──────────
  const applyUpdate = useCallback(() => {
    sendSkipWaiting();
    // Reload is handled by the controllerchange listener in pwa-register.ts
    // with the refreshing guard — no manual reload needed here.
  }, []);

  return { updateReady, isStale, applyUpdate };
}
