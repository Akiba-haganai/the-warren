import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.2, // Capture 20% of transactions in production
    // Session Replay
    replaysSessionSampleRate: 0, // Sample 10% of normal sessions -> 0 to not load replay on normal sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
  });
}