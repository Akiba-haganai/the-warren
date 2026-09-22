import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { writeFileSync } from "fs";
import { resolve } from "path";

const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) 
  ?? new Date().toISOString();

const vercelEnv = process.env.VERCEL_ENV || "local";
const vercelBranch = process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
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
    tsconfigPaths(),
    VitePWA({
      injectRegister: null,
      // generateSW with skipWaiting: false — Workbox generates the SW but
      // will NOT auto-promote. Our pwa-register.ts sends a SKIP_WAITING
      // postMessage only when the user taps the update toast.
      strategies: "generateSW",
      registerType: "prompt",
      workbox: {
        skipWaiting: false,
        // clientsClaim: false — prevents the new SW from immediately seizing
        // control on update, which was the root cause of the controllerchange
        // → reload cascade. The SW takes over on the next navigation instead.
        clientsClaim: false,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/version\.json$/, /^\/api\//],
        globPatterns: [
          "index.html",
          "assets/*.{js,css}",
          "manifest.webmanifest",
          "fonts/*.woff2",
        ],
        globIgnores: ["**/*.map", "**/version.json", "**/vendor-sentry*"],
        runtimeCaching: [
          // Navigation requests: NetworkFirst so we always fetch the freshest index.html from Vercel
          // with a 3s network timeout, falling back to cache only when offline or on a dead connection!
          {
            urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
            handler: "NetworkFirst" as const,
            options: {
              cacheName: "weave-html-cache",
              networkTimeoutSeconds: 3,
            },
          },
          // Lazy route chunks — cache on first use, revalidate in background
          {
            urlPattern: ({ request }: { request: Request }) =>
              request.destination === "script" || request.destination === "style",
            handler: "StaleWhileRevalidate" as const,
            options: { cacheName: "weave-route-chunks" },
          },
          // YouTube thumbnails
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
          // Supabase storage images
          {
            urlPattern: ({ url }: { url: URL }) => url.hostname.endsWith(".supabase.co"),
            handler: "NetworkFirst" as const,
            options: {
              cacheName: "weave-supabase-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 3 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "favicon-32.png", "favicon-16.png", "icon-72.png"],
      manifest: {
        name: "WEAVE",
        short_name: "WEAVE",
        description: "Stories. Culture. What's happening.",
        theme_color: "#FF6D00",
        background_color: "#FF6D00",
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
          // Keep Sentry separate — it's large (~270 KB) and only loaded lazily on error
          if (id.includes("node_modules/@sentry")) {
            return "vendor-sentry";
          }
          // Keep Sanity + rxjs separate — they're large and only used on content pages
          if (id.includes("node_modules/@sanity") || id.includes("node_modules/rxjs")) {
            return "vendor-sanity";
          }
          // Keep Framer Motion separate — animation-heavy, not needed on every route
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          // Everything else (React, ReactDOM, React Router, Supabase, Lucide, etc.)
          // goes in a single vendor chunk. Fewer HTTP round-trips outweigh the
          // slightly coarser caching granularity for this PWA's usage pattern.
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});