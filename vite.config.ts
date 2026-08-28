import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { writeFileSync } from "fs";
import { resolve } from "path";

const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) 
  ?? new Date().toISOString();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
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
      // generateSW with skipWaiting: false — Workbox generates the SW but
      // will NOT auto-promote. Our pwa-register.ts sends a SKIP_WAITING
      // postMessage only when the user taps the update toast.
      strategies: "generateSW",
      registerType: "prompt",
      workbox: {
        skipWaiting: false,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/version\.json$/, /^\/api\//],
        globIgnores: ["**/*.map", "**/version.json"],
        runtimeCaching: [
          // Google Fonts stylesheets
          {
            urlPattern: ({ url }: { url: URL }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate" as const,
            options: { cacheName: "wave-google-fonts-stylesheets" },
          },
          // Google Fonts webfont files
          {
            urlPattern: ({ url }: { url: URL }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst" as const,
            options: {
              cacheName: "wave-google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // YouTube thumbnails
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.hostname === "img.youtube.com" || url.hostname === "i.ytimg.com",
            handler: "CacheFirst" as const,
            options: {
              cacheName: "wave-yt-thumbnails",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Supabase storage images
          {
            urlPattern: ({ url }: { url: URL }) => url.hostname.endsWith(".supabase.co"),
            handler: "NetworkFirst" as const,
            options: {
              cacheName: "wave-supabase-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 3 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "favicon-32.png", "favicon-16.png", "icon-72.png"],
      manifest: {
        name: "WAVE",
        short_name: "WAVE",
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@sentry")) {
            return "vendor-sentry";
          }
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/lucide-react")) {
            return "vendor-ui";
          }
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
});