/**
 * supabaseCache.ts — Simple module-level in-memory cache for Supabase queries.
 *
 * Eliminates redundant round-trips when multiple hooks fire concurrently on
 * mount (e.g. Home page: usePodcasts + useActivePoll + useBlogLikeCounts all
 * hit Supabase within the same render cycle).
 *
 * TTL: 5 minutes. Cache is per tab (resets on hard reload).
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  /** Shared promise so concurrent callers await the same in-flight request. */
  inflight?: Promise<T>;
}

const cache = new Map<string, CacheEntry<unknown>>();
const TTL_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Run `queryFn` and cache the result under `key`.
 * If a fresh cached value exists, return it immediately.
 * If the same query is already in-flight, await that promise instead of
 * issuing a second request.
 */
export async function cachedSupabaseQuery<T>(
  key: string,
  queryFn: () => Promise<T> | PromiseLike<T>,
): Promise<T> {
  const existing = cache.get(key) as CacheEntry<T> | undefined;

  // Return cached data if still fresh
  if (existing && Date.now() - existing.timestamp < TTL_MS) {
    return existing.data;
  }

  // Re-use an in-flight request if one is already running for this key
  if (existing?.inflight) {
    return existing.inflight as Promise<T>;
  }

  // Start a new request and record the promise so concurrent callers share it
  const inflight = Promise.resolve(queryFn()).then((data) => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  });

  // Store the inflight promise (timestamp 0 so it won't be mistaken as fresh)
  cache.set(key, { data: undefined as unknown as T, timestamp: 0, inflight });

  return inflight;
}

/** Manually invalidate a cache entry (e.g. after a mutation). */
export function invalidateCache(key: string): void {
  cache.delete(key);
}
