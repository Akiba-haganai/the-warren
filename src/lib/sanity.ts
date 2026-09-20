import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "7yislksr",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  timeout: 8000, // Fail fast on stalled connections instead of hanging indefinitely
  maxRetries: 2, // Avoid long exponential backoff hangs on mobile
});