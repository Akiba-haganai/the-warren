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