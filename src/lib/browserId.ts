/**
 * Returns a stable, anonymous browser identifier.
 *
 * Reuses the same `warren_voter_id` key that the poll system already writes,
 * so one localStorage entry serves both features.  If no value exists yet,
 * one is generated via `crypto.randomUUID()` and persisted.
 */
const STORAGE_KEY = "warren_voter_id";

export function getBrowserId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
