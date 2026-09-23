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
 * When stale is detected we surface the toast only — we do NOT call
 * registration.update() automatically, because that triggers a SW install cycle
 * which (combined with the old controllerchange listener) caused a reload loop.
 * The user drives the update by tapping "Refresh now" → applyUpdate().
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
    // If device is known to be offline, avoid kicking off network fetches that will time out
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) return;
      const data: { version: string } = await res.json();
      const running = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : null;
      if (running && data.version !== running) {
        setIsStale(true);
        // ── Do NOT call registration.update() here ──────────────────────────
        // Automatically triggering a SW update starts a new install cycle.
        // With the old controllerchange→reload listener this caused a cascade:
        //   stale detected → update() → updatefound → installed → controllerchange → reload
        // The user controls when the update applies by tapping "Refresh now".
      }
    } catch {
      // Silently ignore — network may be offline or high-latency, not worth surfacing
    } finally {
      clearTimeout(timeoutId);
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

  // ── Apply update: promote waiting SW → then reload ───────────────────────
  // The controllerchange→reload listener has been removed from pwa-register.ts
  // so we reload explicitly here after sending SKIP_WAITING.
  const applyUpdate = useCallback(() => {
    sendSkipWaiting();
    // Brief delay so the SW can finish activating before we reload
    setTimeout(() => window.location.reload(), 300);
  }, []);

  return { updateReady, isStale, applyUpdate };
}
