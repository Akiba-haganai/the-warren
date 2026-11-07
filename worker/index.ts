import { onRequestGet as handleOg } from "../functions/api/og";
import { onRequestGet as handleSitemap } from "../functions/api/sitemap";
import { onRequestPost as handleSubmitComment } from "../functions/api/submit-comment";
import { onRequestPost as handleSubmitStory } from "../functions/api/submit-story";
import { onRequest as handleSyncYoutube } from "../functions/api/sync-youtube";

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  [key: string]: unknown;
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

    // Everything else is served by static assets (Vite SPA)
    return env.ASSETS.fetch(request);
  },
};
