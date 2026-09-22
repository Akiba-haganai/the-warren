
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

window.addEventListener("error", (event) => {
  const err = event.error ?? event.message;
  renderFatalError(err);
  import("./lib/sentry")
    .then(({ captureLazyException }) => captureLazyException(err))
    .catch(() => {});
});
window.addEventListener("unhandledrejection", (event) => {
  renderFatalError(event.reason);
  import("./lib/sentry")
    .then(({ captureLazyException }) => captureLazyException(event.reason))
    .catch(() => {});
});

// ── Boot-Crash Nuclear Reset ──────────────────────────────────────────────
// If Vite fails to load a JS chunk (e.g. a stale SW served a file whose hash
// no longer exists on the CDN), increment a strike counter in sessionStorage.
//
// Strike 1: record the failure — do NOT reload immediately. The page may
//   recover on its own (e.g. SW cache has been updated in the background).
// Strike 2+: "nuclear reset" — unregister all service workers, delete every
//   cache bucket, then force a hard reload to pull a fresh build from Vercel.
//
// Using 2 strikes (not 3) means we escape a corrupted install faster, and
// not reloading on strike 1 avoids triggering the controllerchange cascade
// that was the root cause of the "no network" timeout loop.
const CRASH_STRIKE_KEY = "weave:boot_crash_strikes";
window.addEventListener("vite:preloadError", async () => {
  const strikes = parseInt(sessionStorage.getItem(CRASH_STRIKE_KEY) ?? "0", 10) + 1;
  if (strikes >= 2) {
    // Nuclear reset — clear caches and reload cleanly
    sessionStorage.removeItem(CRASH_STRIKE_KEY);
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      // Best-effort — carry on with the reload regardless
    }
    window.location.reload();
  } else {
    // Strike 1: record but don't reload. If the chunk is genuinely missing,
    // the user's next action will retry and hit strike 2 → nuclear reset.
    sessionStorage.setItem(CRASH_STRIKE_KEY, String(strikes));
  }
});


try {
  initThemeFromStorage();

  // ── Sentry is NOT pre-fetched here ────────────────────────────────────────
  // SentryErrorBoundary (below) lazy-imports @sentry/react the first time an
  // error is caught, keeping ~270 KB of Sentry off the critical entry bundle.
  // There's no requestIdleCallback pre-fetch — loading Sentry proactively was
  // consuming bandwidth and blocking FCP/LCP even when no error occurred.

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
    </StrictMode>,
  );
} catch (err) {
  renderFatalError(err);
}