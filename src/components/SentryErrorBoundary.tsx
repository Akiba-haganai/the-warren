import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Thin error boundary that avoids eagerly importing @sentry/react.
 * When an error is caught, it dynamically imports Sentry to report it,
 * then shows the fallback UI. This keeps ~273 KB of Sentry off the
 * critical entry bundle.
 */
export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to Sentry lazily — doesn't block the error UI from rendering
    import("@sentry/react")
      .then(({ captureException }) => {
        captureException(error, { extra: { componentStack: errorInfo.componentStack } });
      })
      .catch(() => {
        // If Sentry fails to load, silently swallow — the error UI still shows
      });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
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
        )
      );
    }

    return this.props.children;
  }
}
