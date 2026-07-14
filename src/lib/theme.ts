// src/lib/theme.ts
export type ThemePreference = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

// Add "export" here ↓
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(pref: ThemePreference): "light" | "dark" {
  return pref === "system" ? getSystemTheme() : pref;
}

function applyThemeToDocument(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function getThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function setThemePreference(pref: ThemePreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  applyThemeToDocument(resolveTheme(pref));
}

export function initThemeFromStorage() {
  if (typeof window === "undefined") return () => {};

  const pref = getThemePreference();
  applyThemeToDocument(resolveTheme(pref));

  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!mq) return () => {};

  const onChange = () => {
    const currentPref = getThemePreference();
    if (currentPref !== "system") return;
    applyThemeToDocument(getSystemTheme());
  };

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }

  mq.addListener(onChange);
  return () => mq.removeListener(onChange);
}