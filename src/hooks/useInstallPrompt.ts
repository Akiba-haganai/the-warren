import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  return Boolean(mql || iosStandalone);
}

function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

// ── Module-level singleton capture ─────────────────────────────────────────
// `beforeinstallprompt` fires once per page load, often before React mounts.
// If we capture it inside a component effect, navigating to a new route
// unmounts the component, and the event is lost forever — the install button
// stops working for the rest of the session.
//
// By capturing at module level, we intercept it exactly once regardless of
// which route is active, and every call to useInstallPrompt() sees the same ref.

let _deferredPrompt: BeforeInstallPromptEvent | null = null;
const _listeners = new Set<() => void>();

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    _deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    _deferredPrompt = null;
    notifyListeners();
  });
}

// ─────────────────────────────────────────────────────────────────────────────

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => _deferredPrompt
  );
  const [installed, setInstalled] = useState(isStandaloneDisplay());
  const [isIOS] = useState(isIOSDevice());

  useEffect(() => {
    if (isStandaloneDisplay()) {
      setInstalled(true);
      return;
    }

    // Subscribe to module-level updates so the component stays in sync
    // even after re-mounts from navigation.
    const onUpdate = () => {
      setDeferredPrompt(_deferredPrompt);
      if (_deferredPrompt === null) setInstalled(true);
    };
    _listeners.add(onUpdate);
    return () => {
      _listeners.delete(onUpdate);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        _deferredPrompt = null;
        setInstalled(true);
      }
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    canInstall: (!installed && !!deferredPrompt) || (!installed && isIOS),
    isIOS,
    isStandalone: installed,
    promptInstall,
  };
}