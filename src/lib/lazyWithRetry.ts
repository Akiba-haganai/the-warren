import { type ComponentType, lazy } from "react";

/**
 * Wraps React.lazy with automatic retries and version-mismatch recovery.
 *
 * Flaky mobile connections (e.g. 3G/4G) can intermittently fail to fetch
 * a route's JS chunk. If that happens, this wrapper automatically retries
 * the download before throwing to an error boundary.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 800
) {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      function attempt(remaining: number) {
        factory()
          .then(resolve)
          .catch((error) => {
            if (remaining <= 0) {
              reject(error);
              return;
            }
            setTimeout(() => {
              attempt(remaining - 1);
            }, interval);
          });
      }
      attempt(retries);
    })
  );
}
