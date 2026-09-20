
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
  renderFatalError(event.error ?? event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  renderFatalError(event.reason);
});

// ── Boot-Crash Nuclear Reset ──────────────────────────────────────────────
// If Vite fails to load a JS chunk (e.g. a stale SW served a file whose hash
// no longer exists on the CDN), increment a strike counter in sessionStorage.
// After 3 consecutive crashes we perform a "nuclear reset":
//   1. Unregister all service workers
//   2. Delete every cache bucket
//   3. Force a hard reload to pull a fresh build from Vercel
// This prevents a corrupted PWA install from permanently bricking itself.
const CRASH_STRIKE_KEY = "weave:boot_crash_strikes";
window.addEventListener("vite:preloadError", async () => {
  const strikes = parseInt(sessionStorage.getItem(CRASH_STRIKE_KEY) ?? "0", 10) + 1;
  if (strikes >= 3) {
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
    sessionStorage.setItem(CRASH_STRIKE_KEY, String(strikes));
    window.location.reload();
  }
});


try {
  initThemeFromStorage();
  
  // Defer Sentry init until well after page load and idle — prevents Sentry's
  // 270 KB bundle and tracing instrumentation from delaying FCP/LCP/TBT.
  // SentryErrorBoundary still catches and reports errors via lazy import if one occurs.
  const initSentry = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => import("./lib/sentry"), { timeout: 8000 });
    } else {
      setTimeout(() => import("./lib/sentry"), 3000);
    }
  };
  if (document.readyState === "complete") {
    setTimeout(initSentry, 3000);
  } else {
    window.addEventListener("load", () => setTimeout(initSentry, 3000), { once: true });
  }

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