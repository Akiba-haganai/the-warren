import { supabase } from "@/lib/supabase";

export type ModerationStatus = "approved" | "rejected";

export async function reviewItem(
  queueId: string,
  status: ModerationStatus,
  note?: string,
) {
  if (!supabase) {
    throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL/ANON_KEY.");
  }

  const userRes = await supabase.auth.getUser();
  const user = userRes.data.user;
  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { error } = await supabase
    .from("moderation_queue")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      reviewer_note: note || null,
    })
    .eq("id", queueId);

  if (error) throw error;

  // If approved, you can later move the record into the live tables based on item_type.
  // (Intentionally left as a placeholder — your feature-specific handlers will be added as you build them.)
}

