import { useEffect, useState } from "react";

const REBRAND_KEY = "commons_rebrand_seen_v1";

// Safari private mode / storage-blocked contexts throw on localStorage access,
// not just on quota — wrap every call, don't assume it's available.
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — banner will just show again next session.
    // Harmless (that's the whole point of the always-show-once-ish design).
  }
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false; // SSR guard
  const mql = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  return Boolean(mql || iosStandalone);
}

export function useRebrandNotice() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isStandaloneDisplay()) return;
    if (safeGetItem(REBRAND_KEY)) return;
    setShowBanner(true);
  }, []);

  const dismiss = () => {
    safeSetItem(REBRAND_KEY, "true");
    setShowBanner(false);
  };

  return { showBanner, dismiss };
}
