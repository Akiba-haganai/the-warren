/**
 * pwa-register.ts — Low-level, framework-agnostic PWA registration utility.
 */

export interface PWARegisterOptions {
  /** Called once the SW is registered (first visit or refresh). */
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  /** Called when a new SW version is waiting — show the update banner. */
  onUpdateReady?: (registration: ServiceWorkerRegistration) => void;
  /** Called if registration fails. */
  onRegisterError?: (error: unknown) => void;
}

let _waitingRegistration: ServiceWorkerRegistration | null = null;

/**
 * Tell the waiting service worker to promote itself.
 * Safe to call multiple times — guards against null.
 */
export function sendSkipWaiting(): void {
  if (_waitingRegistration?.waiting) {
    _waitingRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
  }
}

/**
 * Register the service worker and wire up the full update lifecycle.
 */
export function registerPWA(options: PWARegisterOptions = {}): void {
  // Skip SW registration in local Vite dev mode (localhost) where /sw.js is not generated
  if (import.meta.env.DEV) return;
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const doRegister = () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        options.onRegistered?.(registration);

        const trackWaiting = (worker: ServiceWorker | null) => {
          if (!worker) return;
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            _waitingRegistration = registration;
            options.onUpdateReady?.(registration);
          }
        };

        if (registration.waiting) {
          _waitingRegistration = registration;
          options.onUpdateReady?.(registration);
        }

        if (registration.installing) {
          registration.installing.addEventListener("statechange", (e) => {
            trackWaiting((e.target as ServiceWorker) ?? null);
          });
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            trackWaiting(newWorker);
          });
        });
      })
      .catch((error) => {
        options.onRegisterError?.(error);
        console.error("[Weave SW] Registration failed:", error);
      });
  };

  if (document.readyState === "complete") {
    doRegister();
  } else {
    window.addEventListener("load", doRegister, { once: true });
  }
}
