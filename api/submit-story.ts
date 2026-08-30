import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";

// Server-only client — uses a write token, never exposed to the browser.
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns true if the token is valid, false otherwise.
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If no secret key is configured, skip verification (dev mode).
    console.warn("TURNSTILE_SECRET_KEY not set — skipping bot verification.");
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
    const data = await response.json();
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, body, author, excerpt, turnstileToken } = req.body ?? {};

  // ── Turnstile verification ──────────────────────────────────────────
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return res.status(400).json({ error: "Security verification required." });
    }
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return res.status(403).json({ error: "Security verification failed. Please try again." });
    }
  }

  // ── Input validation ────────────────────────────────────────────────
  if (typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({ error: "Title must be at least 3 characters." });
  }
  if (typeof body !== "string" || body.trim().length < 10) {
    return res.status(400).json({ error: "Story must be at least 10 characters." });
  }
  if (typeof author !== "string" || author.trim().length < 2) {
    return res.status(400).json({ error: "Your name must be at least 2 characters." });
  }

  try {
    // Creating with an _id prefixed "drafts." is what makes this a draft:
    // it will never appear in the site's normal published-dataset queries
    // until someone opens it in Studio and clicks Publish. This is the
    // entire moderation gate — no status column, no RLS policy needed.
    const draftId = `drafts.submission-${randomUUID()}`;

    const doc = await client.create({
      _id: draftId,
      _type: "story",
      title: title.trim(),
      author: author.trim(),
      excerpt: excerpt?.trim() || undefined,
      submittedViaForm: true,
      body: [
        {
          _type: "block",
          _key: randomUUID(),
          style: "normal",
          children: [{ _type: "span", _key: randomUUID(), text: body.trim() }],
        },
      ],
    });

    return res.status(200).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Sanity submission failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
