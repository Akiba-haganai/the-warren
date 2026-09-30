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
        // Trigger a SW update check so there's actually a new worker to promote
        // when the user taps "Refresh now". Without this, skipWaiting would be
        // sent to nothing and the reload would bring back the same old version.
        registrationRef.current?.update().catch(() => {});
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

  // ── Apply update: promote waiting SW → then reload on controllerchange ───
  // Using controllerchange (instead of a blind 300ms timer) means we reload
  // exactly when the new SW has finished activating, not before.
  // This is safe because we removed the old auto-reload controllerchange listener
  // from pwa-register.ts — the only reload now is this explicit user-triggered one.
  const applyUpdate = useCallback(() => {
    // Wire up a one-time reload on controllerchange before sending skipWaiting.
    // Once the new SW claims control, the page reloads with the new assets.
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => window.location.reload(),
      { once: true }
    );
    sendSkipWaiting();
    // Fallback: if controllerchange doesn't fire within 2s (e.g. no waiting SW),
    // reload anyway so the user isn't left with a stale UI.
    setTimeout(() => window.location.reload(), 2000);
  }, []);

  return { updateReady, isStale, applyUpdate };
}
