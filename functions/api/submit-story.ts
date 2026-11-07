import { createClient } from "@sanity/client";

interface Env {
  SANITY_PROJECT_ID?: string;
  VITE_SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  VITE_SANITY_DATASET?: string;
  SANITY_WRITE_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
}

async function verifyTurnstile(token: string, secret?: string): Promise<boolean> {
  if (!secret) {
    return true;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
        }),
      }
    );
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return false;
  }
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  let bodyData: Record<string, unknown> = {};
  try {
    bodyData = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { title, body, author, excerpt, turnstileToken } = bodyData;

  const isLocalhost =
    context.request.url.includes("localhost") || context.request.url.includes("127.0.0.1");

  if (context.env.TURNSTILE_SECRET_KEY) {
    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return Response.json({ error: "Security verification required." }, { status: 400 });
    }
    const isHuman = await verifyTurnstile(turnstileToken, context.env.TURNSTILE_SECRET_KEY);
    if (!isHuman) {
      return Response.json(
        { error: "Security verification failed. Please try again." },
        { status: 403 }
      );
    }
  } else if (!isLocalhost) {
    console.warn("TURNSTILE_SECRET_KEY is not configured in production. Bot protection disabled.");
  }

  if (typeof title !== "string" || title.trim().length < 3) {
    return Response.json({ error: "Title must be at least 3 characters." }, { status: 400 });
  }
  if (title.trim().length > 200) {
    return Response.json({ error: "Title must not exceed 200 characters." }, { status: 400 });
  }

  if (typeof body !== "string" || body.trim().length < 10) {
    return Response.json({ error: "Story must be at least 10 characters." }, { status: 400 });
  }
  if (body.trim().length > 50000) {
    return Response.json({ error: "Story must not exceed 50,000 characters." }, { status: 400 });
  }

  if (typeof author !== "string" || author.trim().length < 2) {
    return Response.json({ error: "Your name must be at least 2 characters." }, { status: 400 });
  }
  if (author.trim().length > 100) {
    return Response.json({ error: "Your name must not exceed 100 characters." }, { status: 400 });
  }

  if (excerpt && typeof excerpt === "string" && excerpt.trim().length > 400) {
    return Response.json({ error: "Excerpt must not exceed 400 characters." }, { status: 400 });
  }

  const client = createClient({
    projectId:
      context.env.SANITY_PROJECT_ID || context.env.VITE_SANITY_PROJECT_ID || "7yislksr",
    dataset:
      context.env.SANITY_DATASET || context.env.VITE_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: context.env.SANITY_WRITE_TOKEN,
    useCdn: false,
  });

  try {
    const draftId = `drafts.submission-${crypto.randomUUID()}`;

    // Story schema matches studio/schemaTypes/storyType.ts
    const doc = await client.create({
      _id: draftId,
      _type: "story",
      title: title.trim(),
      author: author.trim(),
      excerpt: typeof excerpt === "string" ? excerpt.trim() || undefined : undefined,
      submittedViaForm: true,
      body: [
        {
          _type: "block",
          _key: crypto.randomUUID(),
          style: "normal",
          children: [{ _type: "span", _key: crypto.randomUUID(), text: body.trim() }],
        },
      ],
    });

    return Response.json({ ok: true, id: doc._id }, { status: 200 });
  } catch (err) {
    console.error("Sanity submission failed:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};
