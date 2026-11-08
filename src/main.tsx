import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PlayerProvider } from "./contexts/PlayerContext";

import { initThemeFromStorage } from "./lib/theme";
import { SentryErrorBoundary } from "./components/SentryErrorBoundary";

function renderFatalError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : "";
  const rootEl = document.getElementById("root");
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="font-family: monospace; padding: 24px; max-width: 700px; margin: 40px auto; background: #fff; color: #111; border: 2px solid #dc2626; border-radius: 8px;">
        <h1 style="color:#dc2626; font-size: 18px; margin-bottom: 12px;">App failed to start</h1>
        <p style="margin-bottom: 8px;"><strong>${message}</strong></p>
        <pre style="white-space: pre-wrap; font-size: 12px; overflow-x: auto; background:#f9fafb; padding: 12px; border-radius: 4px;">${stack}</pre>
      </div>
    `;
  }
}

// Global error logging to Sentry — do NOT call renderFatalError here!
// renderFatalError wipes out the DOM with "App failed to start" which would
// turn any transient background network blip into a catastrophic screen crash.
window.addEventListener("error", (event) => {
  const err = event.error ?? event.message;
  console.error("[Weave Uncaught Error]", err);
  import("./lib/sentry")
    .then(({ captureLazyException }) => captureLazyException(err))
    .catch(() => {});
});
window.addEventListener("unhandledrejection", (event) => {
  console.warn("[Weave Unhandled Rejection]", event.reason);
  import("./lib/sentry")
    .then(({ captureLazyException }) => captureLazyException(event.reason))
    .catch(() => {});
});

// ── Chunk Loading Auto-Recovery (vite:preloadError) ────────────────────────
// When a new deployment is pushed to production, previously cached HTML may request
// older JS chunks that no longer exist on the server (returning 404).
//
// Automatically recover by clearing stale precache assets and refreshing the page ONCE.
// Guarded with a sessionStorage flag to strictly prevent reload loops.
const CHUNK_RELOAD_KEY = "weave:chunk_reload_done";
window.addEventListener("vite:preloadError", async (event) => {
  event.preventDefault();
  const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);
  if (!alreadyReloaded) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((k) => !k.includes("sanity")) // preserve API cache so offline content survives
            .map((k) => caches.delete(k))
        );
      }
    } catch {}
    window.location.reload();
  } else {
    console.error("[Weave] Chunk failed to load even after cache-refresh reload");
  }
});

try {
  // Clear chunk reload flag on successful start
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  initThemeFromStorage();

  const rootEl = document.getElementById("root");
  if (!rootEl) {
    throw new Error("Could not find #root element in index.html");
  }

  createRoot(rootEl).render(
    <StrictMode>
      <SentryErrorBoundary>
        <BrowserRouter>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </BrowserRouter>
      </SentryErrorBoundary>
    </StrictMode>
  );
} catch (err) {
  renderFatalError(err);
}
