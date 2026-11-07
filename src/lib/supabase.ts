// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

function isPlaceholder(val: string): boolean {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.startsWith("<your_") ||
    lower.startsWith("your-") ||
    lower === "[sensitive]" ||
    lower.includes("your_supabase")
  );
}

const isValidConfig = !isPlaceholder(rawUrl) && !isPlaceholder(rawAnonKey);

if (!isValidConfig) {
  console.warn(
    "[Weave] Missing or placeholder Supabase environment variables in .env.local — replace VITE_SUPABASE_ANON_KEY with your actual Supabase anon public key."
  );
}

// Wrap Supabase fetch with an 8-second timeout so stalled queries fail fast instead of hanging
const timeoutFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const signal = init?.signal
    ? ("any" in AbortSignal ? (AbortSignal as any).any([init.signal, controller.signal]) : init.signal)
    : controller.signal;

  return fetch(input, { ...init, signal }).finally(() => clearTimeout(timeoutId));
};

export const supabase = isValidConfig
  ? createClient(rawUrl, rawAnonKey, {
      global: {
        fetch: timeoutFetch,
      },
    })
  : null;
