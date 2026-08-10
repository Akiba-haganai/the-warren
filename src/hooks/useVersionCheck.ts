import { useEffect, useState } from "react";

export function useVersionCheck() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const currentVersion = __APP_VERSION__;

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setLatestVersion(data.version);
      } catch {
        // Silent — this is informational only, never surface fetch errors to the user
      }
    }

    check(); // on mount
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
    const interval = setInterval(check, 5 * 60_000); // every 5 min while open

    return () => clearInterval(interval);
  }, []);

  return {
    currentVersion,
    latestVersion,
    isStale: latestVersion !== null && latestVersion !== currentVersion,
  };
}
