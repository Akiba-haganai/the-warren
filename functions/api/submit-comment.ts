import { createClient } from "@supabase/supabase-js";

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  VITE_SUPABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
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
        body: JSON.stringify({ secret, response: token }),
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

  const { blog_slug, author_name, content, parent_id, turnstileToken } = bodyData;

  const isLocalhost =
    context.request.url.includes("localhost") || context.request.url.includes("127.0.0.1");

  // In production, bot protection must be strictly enforced
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
    console.warn("TURNSTILE_SECRET_KEY not set in production. Bot protection is disabled.");
  }

  // Strict input validation
  if (
    typeof blog_slug !== "string" ||
    !blog_slug.trim() ||
    blog_slug.length > 120 ||
    !/^[a-z0-9\-_]+$/i.test(blog_slug.trim())
  ) {
    return Response.json({ error: "Invalid article identifier." }, { status: 400 });
  }

  if (
    typeof author_name !== "string" ||
    author_name.trim().length < 2 ||
    author_name.trim().length > 60
  ) {
    return Response.json({ error: "Name must be between 2 and 60 characters." }, { status: 400 });
  }

  if (
    typeof content !== "string" ||
    content.trim().length < 2 ||
    content.trim().length > 2000
  ) {
    return Response.json({ error: "Comment must be between 2 and 2,000 characters." }, { status: 400 });
  }

  if (
    parent_id !== undefined &&
    parent_id !== null &&
    (typeof parent_id !== "string" || parent_id.length > 64)
  ) {
    return Response.json({ error: "Invalid parent comment reference." }, { status: 400 });
  }

  const supabaseUrl = context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL;
  const supabaseKey =
    context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "Supabase connection not configured." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase.from("comments").insert({
      blog_slug: blog_slug.trim(),
      author_name: author_name.trim(),
      content: content.trim(),
      parent_id: typeof parent_id === "string" ? parent_id.trim() : null,
      is_approved: false, // Must be approved by a moderator before display
    });

    if (error) throw error;
    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Supabase insert failed:", err);
    return Response.json(
      { error: "Failed to post comment. Please try again." },
      { status: 500 }
    );
  }
};
