import {
  onRequestGet as handleOg,
  resolveStoryOg,
  resolveEpisodeOg,
  injectOgIntoHtml,
} from "../functions/api/og";
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
  "meta-externalagent",
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
  "skypeuripreview",
  "redditbot",
  "snapchat",
  "viber",
];

function isBotCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((crawler) => ua.includes(crawler));
}

async function serveSpaWithOg(
  request: Request,
  env: Env,
  meta: Awaited<ReturnType<typeof resolveEpisodeOg>>
): Promise<Response> {
  const assetRes = await env.ASSETS.fetch(request);
  const contentType = assetRes.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return assetRes;
  }
  const rawHtml = await assetRes.text();
  const updatedHtml = injectOgIntoHtml(rawHtml, meta);
  const headers = new Headers(assetRes.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response(updatedHtml, {
    status: assetRes.status,
    headers,
  });
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

    // 1. Dynamic Open Graph metadata for Podcast Episode links: /podcasts?episode=<id>
    if (
      request.method === "GET" &&
      (url.pathname === "/podcasts" || url.pathname === "/podcasts/") &&
      url.searchParams.get("episode")
    ) {
      const episodeId = url.searchParams.get("episode")!;
      const userAgent = request.headers.get("user-agent");
      if (isBotCrawler(userAgent)) {
        const ogUrl = new URL("/api/og", request.url);
        ogUrl.searchParams.set("episode", episodeId);
        return handleOg({ request: new Request(ogUrl.toString(), request), env: env as any });
      }
      // Also inject OG tags directly into the SPA HTML so in-app browsers, iMessage,
      // and any crawler with a standard browser User-Agent still see the episode thumbnail
      const meta = await resolveEpisodeOg(episodeId, url.origin, env as any);
      return serveSpaWithOg(request, env, meta);
    }

    // 2. Dynamic Open Graph metadata for Blog Article links: /blogs/:slug
    if (request.method === "GET" && url.pathname.startsWith("/blogs/")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length === 2 && parts[0] === "blogs" && parts[1] !== "preview") {
        const slug = parts[1];
        const userAgent = request.headers.get("user-agent");
        if (isBotCrawler(userAgent)) {
          const ogUrl = new URL("/api/og", request.url);
          ogUrl.searchParams.set("slug", slug);
          return handleOg({ request: new Request(ogUrl.toString(), request), env: env as any });
        }
        const meta = await resolveStoryOg(slug, url.origin, env as any);
        return serveSpaWithOg(request, env, meta);
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
