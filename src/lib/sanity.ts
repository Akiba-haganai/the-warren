import { createClient } from "@sanity/client";

function sanitizeDataset(val?: string | null): string {
  if (!val) return "production";
  const cleaned = val.replace(/['"]/g, "").trim().toLowerCase();
  // Valid Sanity dataset regex: ^~?[a-z0-9_-]+$ and max 64 chars
  if (/^~?[a-z0-9_-]+$/.test(cleaned) && cleaned.length <= 64) {
    return cleaned;
  }
  return "production";
}

function sanitizeProjectId(val?: string | null): string {
  if (!val) return "7yislksr";
  const cleaned = val.replace(/['"]/g, "").trim().toLowerCase();
  if (/^[a-z0-9-]+$/.test(cleaned) && cleaned.length <= 64) {
    return cleaned;
  }
  return "7yislksr";
}

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : ({} as Record<string, string | undefined>);

export const sanityClient = createClient({
  projectId: sanitizeProjectId(env.VITE_SANITY_PROJECT_ID),
  dataset: sanitizeDataset(env.VITE_SANITY_DATASET),
  apiVersion: "2024-01-01",
  useCdn: true,
  timeout: 8000, // Fail fast on stalled connections instead of hanging indefinitely
  maxRetries: 2, // Avoid long exponential backoff hangs on mobile
});
