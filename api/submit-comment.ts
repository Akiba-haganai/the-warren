import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY not set — skipping bot verification in development.");
    return true;
  }
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
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

  const { blog_slug, author_name, content, parent_id, turnstileToken } = req.body ?? {};

  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (isProduction || process.env.TURNSTILE_SECRET_KEY) {
    if (!process.env.TURNSTILE_SECRET_KEY) {
      console.error("TURNSTILE_SECRET_KEY not configured in production.");
      return res.status(500).json({ error: "Server security verification not configured." });
    }
    if (typeof turnstileToken !== "string" || !turnstileToken) {
      return res.status(400).json({ error: "Security verification required." });
    }
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return res.status(403).json({ error: "Security verification failed. Please try again." });
    }
  }

  if (typeof author_name !== "string" || author_name.trim().length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  }
  if (typeof content !== "string" || content.trim().length < 2) {
    return res.status(400).json({ error: "Comment is too short." });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  // Use service_role key to bypass RLS, or anon key if RLS allows it.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Supabase connection not configured." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase.from("comments").insert({
      blog_slug,
      author_name: author_name.trim(),
      content: content.trim(),
      parent_id: parent_id || null,
      is_approved: false, // Must be approved by a moderator
    });

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Supabase insert failed:", err);
    return res.status(500).json({ error: "Failed to post comment. Please try again." });
  }
}
