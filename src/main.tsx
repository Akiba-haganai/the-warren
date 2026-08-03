import "./lib/sentry"; // 👈 must be first — initializes Sentry before anything else
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";
import { PlayerProvider } from "./contexts/PlayerContext";
import { initThemeFromStorage } from "./lib/theme";

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

try {
  initThemeFromStorage();

  const rootEl = document.getElementById("root");
  if (!rootEl) {
    throw new Error("Could not find #root element in index.html");
  }

  createRoot(rootEl).render(
    <StrictMode>
      <Sentry.ErrorBoundary
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-8">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Our team has been notified.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Reload page
              </button>
            </div>
          </div>
        }
        showDialog
      >
        <BrowserRouter>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </BrowserRouter>
      </Sentry.ErrorBoundary>
    </StrictMode>,
  );
} catch (err) {
  renderFatalError(err);
}