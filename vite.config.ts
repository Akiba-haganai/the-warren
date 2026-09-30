import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { writeFileSync } from "fs";
import { resolve } from "path";

const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) 
  ?? new Date().toISOString();

const vercelEnv = process.env.VERCEL_ENV || "local";
const vercelBranch = process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
    __APP_ENV__: JSON.stringify(vercelEnv),
    __APP_BRANCH__: JSON.stringify(vercelBranch),
  },
  plugins: [
    {
      name: "emit-version-json",
      writeBundle() {
        writeFileSync(
          resolve(__dirname, "dist/version.json"),
          JSON.stringify({ version: buildVersion })
        );
      },
    },
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: null,
      // generateSW with skipWaiting: false — Workbox generates the SW but
      // will NOT auto-promote. Our pwa-register.ts sends a SKIP_WAITING
      // postMessage only when the user taps the update toast.
      strategies: "generateSW",
      registerType: "prompt",
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        // Extend denylist: sitemap, robots, llms are static files that should never
        // be served from the app shell, and api/ / version.json bypass SW entirely.
        navigateFallbackDenylist: [/^\/api\//, /^\/version\.json$/, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/llms\.txt$/],
        globPatterns: [
          "index.html",
          "assets/*.{js,css}",
          "manifest.webmanifest",
          "fonts/*.woff2",
        ],
        // Exclude vendor-motion — 132KB that only podcasts/player need. Loads lazily,
        // no point burning users' data on first install. Sentry is also excluded.
        globIgnores: ["**/*.map", "**/version.json", "**/vendor-sentry*", "**/vendor-motion*"],
        runtimeCaching: [
          // Sanity CDN API — StaleWhileRevalidate: serves the cached GROQ response
          // immediately (instant repeat visits) while refreshing in the background.
          // This is the biggest repeat-visit win — blog lists, topics, podcasts all come from here.
          {
            urlPattern: ({ url }: { url: URL }) => url.hostname.endsWith("apicdn.sanity.io"),
            handler: "StaleWhileRevalidate" as const,
            options: {
              cacheName: "sanity-api",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 3 },
            },
          },
          // Sanity image CDN — CacheFirst: images are content-addressed (URL changes
          // when the image changes) so an old cached URL is always the right image.
          // maxEntries kept low (80) because opaque cross-origin responses count as
          // ~7 MB each toward Chrome's storage quota estimate.
          {
            urlPattern: ({ url }: { url: URL }) => url.hostname === "cdn.sanity.io",
            handler: "CacheFirst" as const,
            options: {
              cacheName: "sanity-img",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Supabase REST API only — NetworkFirst with timeout so flaky connections
          // fall back to cache rather than hanging. Deliberately scoped to /rest/v1/
          // to avoid caching storage blobs or authenticated responses.
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/rest/v1/"),
            handler: "NetworkFirst" as const,
            options: {
              cacheName: "supabase-rest",
              networkTimeoutSeconds: 4,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          // YouTube thumbnails — CacheFirst since thumbnail URLs are stable per video
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.hostname === "img.youtube.com" || url.hostname === "i.ytimg.com",
            handler: "CacheFirst" as const,
            options: {
              cacheName: "weave-yt-thumbnails",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "favicon-32.png", "favicon-16.png", "icon-72.png"],
      manifest: {
        // id: "/" locks the PWA install identity to this origin+path. Without it,
        // moving to a new domain (e.g. Cloudflare) creates a separate installed app.
        id: "/",
        name: "WEAVE",
        short_name: "WEAVE",
        description: "Stories. Culture. What's happening.",
        theme_color: "#2563EB",
        background_color: "#2563EB",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, "/");

          // Keep Sentry separate — large (~270 KB) and only loaded lazily on error
          if (normalized.includes("node_modules/@sentry")) {
            return "vendor-sentry";
          }

          // Keep Sanity + rxjs separate — only used on content pages
          if (normalized.includes("node_modules/@sanity") || normalized.includes("node_modules/rxjs")) {
            return "vendor-sanity";
          }

          // Keep Framer Motion separate — animation-heavy, only used for Podcasts/Player
          if (normalized.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }


        },
      },
    },
  },
});