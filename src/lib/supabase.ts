// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn("Missing Supabase environment variables — podcast data will not load.");
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

export const supabase = url && anonKey
  ? createClient(url, anonKey, {
      global: {
        fetch: timeoutFetch,
      },
    })
  : null;