import { onRequestGet as handleOg } from "../functions/api/og";
import { onRequestGet as handleSitemap } from "../functions/api/sitemap";
import { onRequestPost as handleSubmitComment } from "../functions/api/submit-comment";
import { onRequestPost as handleSubmitStory } from "../functions/api/submit-story";
import { onRequest as handleSyncYoutube, runYoutubeSync } from "../functions/api/sync-youtube";

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  [key: string]: unknown;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface ScheduledController {
  readonly scheduledTime: number;
  readonly cron: string;
  noRetry(): void;
}

const CRAWLER_USER_AGENTS = [
  "facebookexternalhit",
  "whatsapp",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "telegrambot",
  "applebot",
  "bingbot",
  "googlebot",
  "embedly",
  "pinterest",
  "quora link preview",
];

function isBotCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((crawler) => ua.includes(crawler));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/og" && request.method === "GET") {
      return handleOg({ request, env: env as any });
    }
    if (
      (url.pathname === "/api/sitemap" || url.pathname === "/sitemap.xml") &&
      request.method === "GET"
    ) {
      return handleSitemap({ request, env: env as any });
    }
    if (url.pathname === "/api/submit-comment" && request.method === "POST") {
      return handleSubmitComment({ request, env: env as any });
    }
    if (url.pathname === "/api/submit-story" && request.method === "POST") {
      return handleSubmitStory({ request, env: env as any });
    }
    if (url.pathname === "/api/sync-youtube") {
      return handleSyncYoutube({ request, env: env as any });
    }

    // Serve Rich Open Graph HTML for bots sharing blog articles on WhatsApp, Facebook, Twitter, etc.
    if (request.method === "GET" && url.pathname.startsWith("/blogs/")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length === 2 && parts[0] === "blogs" && parts[1] !== "preview") {
        const userAgent = request.headers.get("user-agent");
        if (isBotCrawler(userAgent)) {
          const ogUrl = new URL("/api/og", request.url);
          ogUrl.searchParams.set("slug", parts[1]);
          const ogRequest = new Request(ogUrl.toString(), request);
          return handleOg({ request: ogRequest, env: env as any });
        }
      }
    }

    // Everything else is served by static assets (Vite SPA)
    return env.ASSETS.fetch(request);
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      runYoutubeSync(env as any)
        .then((res) => {
          console.log(
            `[CRON] YouTube sync succeeded at ${new Date(controller.scheduledTime).toISOString()}: ${res.synced} episodes synced.`
          );
        })
        .catch((err) => {
          console.error("[CRON] YouTube sync failed:", err);
        })
    );
  },
};
