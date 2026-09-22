let initialized = false;

export async function captureLazyException(
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  try {
    const Sentry = await import("@sentry/react");
    if (!initialized) {
      const dsn = import.meta.env.VITE_SENTRY_DSN;
      if (dsn) {
        Sentry.init({
          dsn,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
          ],
          tracesSampleRate: 0.2,
          replaysSessionSampleRate: 0,
          replaysOnErrorSampleRate: 1.0,
        });
      }
      initialized = true;
    }
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } catch {
    // Silently ignore if Sentry fails to load (e.g., ad-blocker or offline)
  }
}