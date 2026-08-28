/**
 * pwa-register.ts — Low-level, framework-agnostic PWA registration utility.
 *
 * Responsibilities:
 *  1. Register /sw.js (the Vite-built service worker).
 *  2. Detect when a new SW reaches "installed" (waiting) state.
 *  3. Fire an onUpdateReady callback so React UI can show the update banner.
 *  4. Guard the controllerchange→reload path with a `refreshing` boolean
 *     to prevent the infinite-reload loop bug.
 *  5. Export sendSkipWaiting() so the UI can promote the waiting worker
 *     only when the user explicitly accepts the update.
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
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // ── Guard: prevent infinite reload on controllerchange double-fire ────────
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    // Small delay so any in-flight XHR/fetch can settle before the page reloads
    setTimeout(() => window.location.reload(), 300);
  });

  // ── Register SW ───────────────────────────────────────────────────────────
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        options.onRegistered?.(registration);

        // Helper: check if the worker that just changed state is "waiting"
        const trackWaiting = (worker: ServiceWorker | null) => {
          if (!worker) return;
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            // A new version is waiting — surface the update banner
            _waitingRegistration = registration;
            options.onUpdateReady?.(registration);
          }
        };

        // Case A: a new SW was already found before we got here
        if (registration.waiting) {
          _waitingRegistration = registration;
          options.onUpdateReady?.(registration);
        }

        // Case B: a new SW is actively installing right now
        if (registration.installing) {
          registration.installing.addEventListener("statechange", (e) => {
            trackWaiting((e.target as ServiceWorker) ?? null);
          });
        }

        // Case C: a new SW starts installing after we register
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            trackWaiting(newWorker);
          });
        });
      })
      .catch((error) => {
        options.onRegisterError?.(error);
        console.error("[WAVE SW] Registration failed:", error);
      });
  });
}
