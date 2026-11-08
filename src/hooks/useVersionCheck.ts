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
        console.warn("[Weave] SW registration error:", err);
      },
    });
  }, []);

  // ── Proactive version polling via /version.json ───────────────────────────
  const checkVersion = useCallback(async () => {
    // Skip version polling in local Vite dev mode where /version.json is not emitted
    if (import.meta.env.DEV) return;
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
        registrationRef.current?.update().catch(() => {});
      }
    } catch {
      // Silently ignore — network may be offline or high-latency
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    checkVersion();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = setInterval(checkVersion, 5 * 60_000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [checkVersion]);

  const applyUpdate = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator)) {
      window.location.reload();
      return;
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => window.location.reload(),
      { once: true }
    );

    // Case 1: A worker is already waiting in background
    if (registrationRef.current?.waiting) {
      sendSkipWaiting();
      setTimeout(() => window.location.reload(), 2500);
      return;
    }

    // Case 2: Stale version detected, trigger update check and listen for install completion
    if (registrationRef.current) {
      registrationRef.current
        .update()
        .then((reg) => {
          if (reg?.waiting) {
            sendSkipWaiting();
            setTimeout(() => window.location.reload(), 2500);
          } else if (reg?.installing) {
            reg.installing.addEventListener("statechange", (e) => {
              const worker = e.target as ServiceWorker;
              if (worker.state === "installed") {
                sendSkipWaiting();
                setTimeout(() => window.location.reload(), 2500);
              }
            });
          } else {
            window.location.reload();
          }
        })
        .catch(() => {
          window.location.reload();
        });
      return;
    }

    window.location.reload();
  }, []);

  return { updateReady, isStale, applyUpdate };
}
